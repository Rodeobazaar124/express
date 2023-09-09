/*
 Ini adalah Route auth, semua rute disini bisa diakses secara bebas untuk membuat akun mau pun login
 */


import express from "express";
import AuthController from "../controllers/AuthController";
const route = express.Router();
if (process.env.REGISTER_ENABLED == "true") {
  route.post(
    "/register",
    AuthController.Register
  );
}

route.post(
  "/login",
  AuthController.Login
);

route.post(
  "/refreshToken",
  AuthController.refreshToken
);

export default { route }
