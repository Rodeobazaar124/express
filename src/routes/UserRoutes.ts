import express, { NextFunction, Request, Response } from "express";
import { isAuthenticated } from "../middleware/authMiddleware";
import { findUserById } from "../controllers/UserController";
interface Req extends Request {
  payload: any;
}

export const userRoutes = express.Router();

userRoutes.get(
  "/profile",
  isAuthenticated,
  async (req: Req, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.payload;
      const user = await findUserById(userId);
      delete user.password;
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
);
