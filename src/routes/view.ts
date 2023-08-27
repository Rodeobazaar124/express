import { Router } from "express";
import path from "path";

const view = Router();
view.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

export default view;
