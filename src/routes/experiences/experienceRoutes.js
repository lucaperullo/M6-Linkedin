// import express from "express";
// import asyncHandler from "../../core/asyncHandler.js";
// import ExperienceModel from "../../database/mongo/models/ExperienceModel.js";
// import UserModel from "../../database/mongo/models/UserModel.js";

// const router = express.Router();

// router.get(
//   "/:userId/experiences",
//   asyncHandler(async (req, res, next) => {
//     const experiences = await ExperienceModel.find();
//     res.send(reviews);
//   })
// );

// router.get(
//   "/:userId/experiences/:experienceId",
//   asyncHandler(async (req, res, next) => {
//     const experience = await ExperienceModel.findById(req.params.experienceId);
//     res.send(experience);
//   })
// );

// router.post(
//   "/userId/experiences",
//   asyncHandler(async (req, res, next) => {
//     const newExperience = new ExperienceModel(req.body);
//     const experience = { ...newExperience.toObject };
//     await UserModel.findByIdAndUpdate(
//       req.params.userId,
//       {
//         $push: {
//           experiences: { ...experience },
//         },
//       },
//       {
//         runValidators: true,
//         new: true,
//       }
//     );
//     res.send(experience);
//   })
// );

// router.put(
//   "/:userId/experiences/:experienceId",
//   asyncHandler(async (req, res, next) => {
//     const modifiedExperience = await ExperienceModel.findByIdAndUpdate(
//       {
//         _id: req.params.experienceId,
//         "experiences._id": req.params.experienceId,
//       },
//       {
//         $set: {
//           "experiences.$": {
//             ...req.body,
//             _id: req.params.experienceId,
//             updatedAt: new Date(),
//           },
//         },
//       },
//       {
//         runValidators: true,
//         new: true,
//       }
//     );
//     if (modifiedExperience) {
//       res.send(modifiedExperience);
//     } else {
//       const error = new Error();
//       error.httpStatusCode = 404;
//       next(error);
//     }
//   })
// );

// router.delete(
//   "/:userId/experiences/:experienceId",
//   asyncHandler(async (req, res, next) => {
//     const modifiedUser = await UserModel.findByIdAndUpdate(
//       {
//         _id: req.params.userId,
//       },
//       {
//         $pull: {
//           experiences: { _id: req.params.experienceId },
//         },
//       },
//       { new: true }
//     );
//     if (modifiedUser) {
//       res.send("User experiences modified");
//     } else {
//       const error = new Error();
//       error.httpStatusCode = 404;
//       next(error);
//     }
//   })
// );

// const cloudStorage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "LinkedIn",
//   },
// });

// const cloudMulter = multer({
//   storage: cloudStorage,
//   fileFilter: function (req, file, next) {
//     const acceptedExtensions = [".png", ".jpg", ".gif", "bmp", ".jpeg"];
//     if (!acceptedExtensions.includes(extname(file.originalname))) {
//       return next(
//         new ErrorResponse(
//           `Image type not allowed: ${extname(file.originalname)}`
//         )
//       );
//     }
//     next(null, true);
//   },
// });

// router.post(
//   "/:userId/upload/:experienceId",
//   asyncHandler(async (req, res, next) => {
//     const modifiedUser = await UserModel.findByIdAndUpdate(
//       {
//         _id: req.params.userId,
//         "experiences._id": req.params.experienceId,
//       },
//       {
//         $set: {
//           "reviews.$": {
//             ...req.body,
//             image: req.file.path,
//             _id: req.params.experienceId,
//             updatedAt: new Date(),
//           },
//         },
//       },
//       { new: true }
//     );
//     res.send(modifiedUser);
//   })
// );

// export default router;
