import { Router } from "express";
import path from "path";
import fs from "fs";

const view = Router();
view.get("^/$|/index(.html)?", (req, res) => {
  if (fs.existsSync(path.join(__dirname, "..", "views", "index.html"))) {
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
  } else {
    res.send("THE SERVER IS RUNNING NOW");
  }
});

export default view;
