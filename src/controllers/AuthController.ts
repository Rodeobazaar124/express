import { NextFunction, Request, Response } from "express";
import { db } from "../app/database";
import { generateTokens, hashToken } from "../app/jwt";
import { ResponseError } from "../error/response-error";
import { createUserByEmailAndPassword, findUserByEmail, findUserById } from "./UserController";
import bcrypt from 'bcrypt';
import { v4 } from "uuid";
import jwt from 'jsonwebtoken';

const addRefreshTokenToWhitelist = function ({
  jti,
  refreshToken,
  userId,
}) {
  return db.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
};

// untuk memastikan token dari user ada di database
const findRefreshTokenById = function (id: string | any) {
  return db.refreshToken.findUnique({
    where: {
      id,
    },
  });
};

// Menghapus token setelah digunakan
const deleteRefreshToken = function (id: string | any) {
  return db.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
};
const revokeTokens = function (userId: string | String | any) {
  return db.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
};
const Register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, username, email, password } = req.body;
    if (!email || !password) {
      throw new ResponseError(
        400,
        `You must provide an email and a password`
      );
    }
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new ResponseError(400, "Email Already In Use");
    }
    const user = await createUserByEmailAndPassword({
      name,
      username,
      email,
      password,
    });
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
const Login = async (req: Request, res: Response, next: NextFunction) => {
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
const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
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

export default { Login, Register, deleteRefreshToken, addRefreshTokenToWhitelist, revokeTokens, findRefreshTokenById, refreshToken }