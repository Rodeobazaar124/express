import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../app/database";

interface authenticatedUser extends Request {
  user: any;
}

export const authMiddleware = async (
  req: authenticatedUser,
  res: Response,
  next: NextFunction
) => {
  const token = req.get("Authorization");
  if (!token) {
    res
      .status(401)
      .json({
        errors: "Unauthorized",
      })
      .end();
  } else {
    const user = await prismaClient.user.findFirst({
      where: {
        token: token,
      },
    });
    if (!user) {
      res
        .status(401)
        .json({
          errors: "Unauthorized",
        })
        .end();
    } else {
      req.user = user;
      next();
    }
  }
};
