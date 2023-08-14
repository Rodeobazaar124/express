import { Request, Response, Router } from "express";
import passport from "passport";

const AuthRouter = Router();

AuthRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.GOOGLE_CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

AuthRouter.get("/login/failed", (req: Request, res: Response) => {
  res.status(401).json({
    error: true,
    message: "Login failed",
  });
});

AuthRouter.get("/login/success", (req: Request, res: Response) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully logged in",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Unauthorized" });
  }
});

AuthRouter.get("/logout", (req: Request, res: Response) => {
  req.logout((err) => {
    console.log(err);
  });
  res.redirect(process.env.GOOGLE_CLIENT_URL);
});

export default AuthRouter;
