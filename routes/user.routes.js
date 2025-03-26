import {Router} from "express";

import protect from "../middleware/auth.middleware.js";

import {getUser, getUsers} from "../controllers/user.controller.js";

const userRouter = Router();

// userRouter.get('/', (req, res) => res.send({title: 'GET users'}));

userRouter.get('/', getUsers);

// userRouter.get('/:id', (req, res) => res.send({title: 'GET user details'}));
userRouter.get('/:id', protect, getUser);

userRouter.post('/:id', (req, res) => res.send({title: 'UPDATE a new user'}));

userRouter.put('/:id', (req, res) => res.send({title: 'UPDATE user'}));

userRouter.delete('/:id', (req, res) => res.send({title: 'DELETE user'}));

export default userRouter;
