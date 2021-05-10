import express from "express";
import userRoutes from "./profile/userRoutes.js";

const router = express.Router();

/*-------------------------------------------------------------------------*/
// Below all APIs are public APIs protected by api-key
// router.use('/', apikey);
/*-------------------------------------------------------------------------*/

router.use("/users", userRoutes);

export default router;
