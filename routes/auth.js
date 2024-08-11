import { signIn, signUp, updateUserTags } from "../controller/auth.js";
import express from "express";
const authRouter = express.Router();
authRouter.post("/signIn", signIn);
authRouter.post("/signUp", signUp);
authRouter.put("/update-tags/:userId", updateUserTags);
export default authRouter;
