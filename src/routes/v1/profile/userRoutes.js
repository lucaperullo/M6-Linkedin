import express from "express";
import { asyncHandler } from "../../../core/asyncHandler.js";
import { BadRequestError, NotFoundError } from "../../../core/apiErrors.js";
import UserModel from "../../../database/mongo/models/UserModel.js";
import ExperienceModel from "../../../database/mongo/models/ExperienceModel.js";
import multer from "multer";
import cloudinary from "cloudinary";

import { CloudinaryStorage } from "multer-storage-cloudinary";
import { extname } from "path";
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit";
import axios from "axios";
const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "LinkedIn",
  },
});

const cloudMulter = multer({
  storage: cloudStorage,
  fileFilter: function (req, file, next) {
    const acceptedExtensions = [".png", ".jpg", ".gif", "bmp", ".jpeg"];
    if (!acceptedExtensions.includes(extname(file.originalname))) {
      return next(
        new ErrorResponse(
          `Image type not allowed: ${extname(file.originalname)}`
        )
      );
    }
    next(null, true);
  },
});

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const users = await UserModel.find();

    if (!users) next(new NotFoundError("User not found"));

    res.status(200).send(users);
  })
);
router.get(
  "/me",
  asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    const decoded = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    const user = (req.userData = decoded).sub[0];

    console.log(user);
    return res.status(200).send(user);
  })
);
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      res.send(user).status(200);
    }
  })
);

router.put(
  "/:id/upload",
  cloudMulter.single("ProfileImage"),
  async (req, res) => {
    try {
      const alteredPost = await UserModel.update(
        { ...req.body, imgurl: req.file.path },
        {
          where: { id: req.params.id },
          returning: true,
        }
      );
      res.send(alteredPost);
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went bad!");
    }
  }
);
router.delete(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (user) {
      res.send({ message: "user destroyed" }).status(204);
    }
  })
);

router.get(
  "/:userId/experiences",
  asyncHandler(async (req, res, next) => {
    const { experiences } = await UserModel.findById(req.params.userId);
    res.send(experiences).status(200);
  })
);

router.get(
  "/:userId/experiences/:experienceId",
  asyncHandler(async (req, res, next) => {
    const experience = await UserModel.findById(
      {
        _id: req.params.userId,
      },
      {
        experiences: {
          $elemMatch: { _id: req.params.experienceId },
        },
      }
    );
    res.send(experience).status(200);
  })
);

router.post(
  "/:userId/experiences",
  asyncHandler(async (req, res, next) => {
    const newExperience = new ExperienceModel(req.body);
    const experience = { ...newExperience.toObject() };
    await UserModel.findByIdAndUpdate(
      req.params.userId,
      {
        $push: {
          experiences: { ...experience, created_At: new Date() },
        },
      },
      {
        runValidators: true,
        new: true,
      }
    );
    res.status(201).send(experience);
  })
);

router.put(
  "/:userId/experiences/:experienceId",
  asyncHandler(async (req, res, next) => {
    const modifiedExperience = await UserModel.findOneAndUpdate(
      {
        _id: req.params.userId,
        "experiences._id": req.params.experienceId,
      },
      {
        $set: {
          "experiences.$": {
            ...req.body,
            _id: req.params.experienceId,
            updated_At: new Date(),
          },
        },
      },
      {
        runValidators: true,
        new: true,
      }
    );
    if (!modifiedExperience) {
      new NotFoundError(`User not found!`);
    }
    res.status(202).send(modifiedExperience);
  })
);

router.delete(
  "/:userId/experiences/:experienceId",
  asyncHandler(async (req, res, next) => {
    const modifiedUser = await UserModel.findByIdAndUpdate(
      {
        _id: req.params.userId,
      },
      {
        $pull: {
          experiences: { _id: req.params.experienceId },
        },
      },
      { new: true }
    );
    if (modifiedUser) {
      new NotFoundError(`User not found!`);
    }
    res.send("User experiences modified");
  })
);

router.post(
  "/:userId/upload/:experienceId",
  cloudMulter.single("image"),
  asyncHandler(async (req, res, next) => {
    const modifiedUser = await UserModel.findByIdAndUpdate(
      {
        _id: req.params.userId,
        "experiences._id": req.params.experienceId,
      },
      {
        $set: {
          "experiences.$": {
            image: req.file.path,
            _id: req.params.experienceId,
            updated_At: new Date(),
          },
        },
      },
      { runValidators: true, new: true }
    );
    res.status(202).send(modifiedUser);

    if (!modifiedUser) {
      new BadRequestError(`Error while uploading picture`);
    }

    res.status(201).send(modifiedUser);
  })
);
router.put(
  "/:id/upload",
  cloudMulter.single("ProfileImage"),
  async (req, res) => {
    try {
      const alteredPost = await UserModel.updateOne(
        { ...req.body, image: req.file.path },
        {
          where: { id: req.params.id },
          returning: true,
        }
      );
      res.send(alteredPost);
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went bad!");
    }
  }
);
router.get("/:id/profilePDF", async (req, res, next) => {
  try {
    const profile = await UserModel.findById(req.params.id);
    let experience = await ExperienceModel.find({
      where: { profileId: req.params.id },
      raw: true,
    });
    // experience = experience.get({ plain: true })
    console.log(experience);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${profile.name}.pdf`
    );
    console.log(1);
    async function example() {
      const doc = new PDFDocument();

      await axios
        .get(profile.image, { responseType: "arraybuffer" })
        .then((response) => {
          const imageBuffer = Buffer.from(response.data);
          doc.image(imageBuffer, 15, 15, { width: 250, height: 270 });
        });
      doc.text("PERSONAL INFOS", 350, 20);
      doc.text("EXPERIENCES", 230, 325);

      row(doc, 40);
      row(doc, 60);
      row(doc, 80);
      row(doc, 100);
      row(doc, 120);
      row(doc, 210);
      row(doc, 230);
      row(doc, 250);
      row(doc, 270);
      row(doc, 290);
      row(doc, 310);
      textInRowFirst(doc, "Name:", 40);
      textInRowFirst(doc, "Surname:", 60);
      textInRowFirst(doc, "Email:", 80);
      textInRowFirst(doc, "Area:", 100);
      textInRowFirst(doc, "Username:", 120);

      textInRowSecond(doc, profile.name, 40);
      textInRowSecond(doc, profile.surename, 60);
      textInRowSecond(doc, profile.email, 80);
      textInRowSecond(doc, profile.area, 100);
      textInRowSecond(doc, profile.username, 120);

      const exLineHeight = 345;
      const addSpace = 160;
      const jForLenght = experience.length;

      let LineHeight = exLineHeight;
      for (let i = 0; i < jForLenght; i++) {
        textInRowFirstExperiences(doc, "Role:", LineHeight); //345
        textInRowFirstExperiences(doc, "Company:", LineHeight + 20); //365
        textInRowFirstExperiences(doc, "Start Date:", LineHeight + 40); // 385
        textInRowFirstExperiences(doc, "End Date:", LineHeight + 60); // 405
        textInRowFirstExperiences(doc, "Description:", LineHeight + 80); // 425
        textInRowFirstExperiences(doc, "Area:", LineHeight + 100); // 445

        textInRowSecondExperiences(doc, experience[i].role, LineHeight); //345
        textInRowSecondExperiences(doc, experience[i].company, LineHeight + 20);
        textInRowSecondExperiences(
          doc,
          experience[i].startdate,
          LineHeight + 40
        );
        textInRowSecondExperiences(doc, experience[i].enddate, LineHeight + 60);
        textInRowSecondExperiences(
          doc,
          experience[i].description,
          LineHeight + 80
        );
        textInRowSecondExperiences(doc, experience[i].area, LineHeight + 100); // 445

        LineHeight = exLineHeight + addSpace * (i + 1);
      }

      doc.pipe(res);
      doc.end();
      doc.on("finish", function () {
        return res.status(200).json({
          ok: "ok",
        });
      });
    }

    function textInRowFirst(doc, text, heigth) {
      doc.y = heigth;
      doc.x = 275;
      doc.fillColor("black");
      doc.text(text, {
        paragraphGap: 5,
        indent: 5,
        align: "justify",
        columns: 1,
      });
      return doc;
    }

    function textInRowSecond(doc, text, heigth) {
      doc.y = heigth;
      doc.x = 375;
      doc.fillColor("black");
      doc.text(text, {
        paragraphGap: 5,
        indent: 5,
        align: "justify",
        columns: 1,
      });
      return doc;
    }

    function textInRowFirstExperiences(doc, text, heigth) {
      doc.y = heigth;
      doc.x = 15;
      doc.fillColor("black");
      doc.text(text, {
        paragraphGap: 5,
        indent: 5,
        align: "justify",
        columns: 1,
      });
      return doc;
    }

    function textInRowSecondExperiences(doc, text, heigth) {
      doc.y = heigth;
      doc.x = 120;
      doc.fillColor("black");
      doc.text(text, {
        paragraphGap: 5,
        indent: 5,
        align: "justify",
        columns: 1,
      });
      return doc;
    }

    function row(doc, heigth) {
      doc.lineJoin("miter").rect(30, heigth, 500, 20);
      return doc;
    }
    example();
  } catch (error) {
    console.log(error);
    next("While reading profiles list a problem occurred!");
  }
});

export default router;
