import express, { NextFunction, Request, Response } from "express";
import { v4 } from "uuid";
import { generateTokens } from "../app/jwt";
import {
  addRefreshTokenToWhitelist,
  deleteRefreshToken,
  findRefreshTokenById,
} from "../services/Auth.services";
import jwt from "jsonwebtoken";
export const AuthRoutes = express.Router();
import {
  findUserByEmail,
  createUserByEmailAndPassword,
  findUserById,
} from "../services/User.services";

AuthRoutes.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400);
        throw new Error(`You must provide an email and a password`);
      }
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        res.status(400);
        throw new Error("Email Already In Use");
      }
      const user = await createUserByEmailAndPassword({ email, password });
      const jti = v4();
      const { accessToken, refreshToken } = generateTokens(user, jti);
      await addRefreshTokenToWhitelist({
        jti,
        refreshToken,
        userId: user.id,
      });

      res.json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  }
);

// add bcrypt at the top of the file.
import bcrypt from "bcrypt";
import { hashToken } from "../app/hashToken";

AuthRoutes.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400);
        throw new Error("You must provide an email and a password.");
      }

      const existingUser = await findUserByEmail(email);

      if (!existingUser) {
        res.status(403);
        throw new Error("Invalid login credentials.");
      }

      const validPassword = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!validPassword) {
        res.status(403);
        throw new Error("Invalid login credentials.");
      }

      const jti = v4();
      const { accessToken, refreshToken } = generateTokens(existingUser, jti);
      await addRefreshTokenToWhitelist({
        jti,
        refreshToken,
        userId: existingUser.id,
      });

      res.json({
        accessToken,
        refreshToken,
      });
    } catch (err) {
      next(err);
    }
  }
);

AuthRoutes.post(
  "/refreshToken",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400);
        throw new Error("Missing refresh token.");
      }
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const savedRefreshToken = await findRefreshTokenById(payload.jti);

      if (!savedRefreshToken || savedRefreshToken.revoked === true) {
        res.status(401);
        throw new Error("Unauthorized");
      }

      const hashedToken = hashToken(refreshToken);
      if (hashedToken !== savedRefreshToken.hashedToken) {
        res.status(401);
        throw new Error("Unauthorized");
      }

      const user = await findUserById(payload.userId);
      if (!user) {
        res.status(401);
        throw new Error("Unauthorized");
      }

      await deleteRefreshToken(savedRefreshToken.id);
      const jti = v4();
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(
        user,
        jti
      );
      await addRefreshTokenToWhitelist({
        jti,
        refreshToken: newRefreshToken,
        userId: user.id,
      });

      res.json({
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (err) {
      next(err);
    }
  }
);
