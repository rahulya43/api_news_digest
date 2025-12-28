import express from "express";
import {createUser,getUserById,updateUser} from "../controllers/userController.js"

const userRouter = express.Router();

userRouter.post('/',createUser);
userRouter.get('/:id',getUserById);
userRouter.put('/:id',updateUser);

export default userRouter;



