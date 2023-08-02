import "dotenv/config";
import express, { Request, Response, response } from "express";
import cors from "cors";
import fileupload from "express-fileupload";
import path from "path";
import bodyParser from "body-parser";
import TestimoniesRoutes from "./routes/TestimoniesRoutes";
import ServicesRoutes from "./routes/ServicesRoutes";

export const app = express();
export const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(fileupload());
app.use(express.static(path.join(__dirname, "../public")));

// app.use((req: Request, res: Response, next) => {
//   console.log("Request received:");
//   console.log("  IP Address: http://" + req.ip.replace("::ffff:", ""));
//   // console.log("  Method:", req.method);
//   // console.log("  URL:", req.url);
//   // console.log("  Headers:", req.headers);
//   // console.log("  Body:", req.body);
//   next();
// });

// app.get("/ping", (req: Request, res: Response) => {
//   res.send("Pong!");
// });
app.use("/Testimonies", TestimoniesRoutes);
app.use("/Services", ServicesRoutes);
