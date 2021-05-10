import express from "express";
import auth from "../../guard/auth.js";
import userRoutes from "./profile/userRoutes.js";
import postRoutes from "./post/postRoutes.js";
import verifyToken from "../../core/guardCore.js";

const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by jwt-key
// router.use('/', verifyToken);
/*-------------------------------------------------------------------------*/

router.use("/", auth);
router.use("/users", verifyToken, userRoutes);
router.use("/posts", verifyToken, postRoutes);

export default router;
