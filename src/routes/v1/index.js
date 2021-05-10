import express from "express";
import auth from "../../guard/auth.js";
import userRoutes from "./profile/userRoutes.js";
import postRoutes from "./post/postRoutes.js";

const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
// router.use('/', apikey);
/*-------------------------------------------------------------------------*/
router.use("/jwt", auth);

router.use('/users', userRoutes)
router.use('/posts', postRoutes)



export default router;
