import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import fileupload from "express-fileupload";
import path from "path";
import fs from "fs";
import AuthRoutes from "../routes/AuthRoutes";
import { errorMiddleware } from "../middleware/error-middleware";
import Routes from "../routes/public-api";
import PrivateRoutes from "../routes/api";
import { userRoutes } from "../routes/UserRoutes";
export const app = express();
export const PORT = process.env.PORT || 80 || 8000;


//  Menghindari error cors dengan cors middleware
app.use(cors());

// JSON-ify request yang datang
app.use(express.json());

// Handle gambar jika perlu
app.use(fileupload());

// Menambahkan rute statis yang dapat diakses kapan saja
app.use(express.static(path.join("public")));

// Meng-adress semua routes yang ada di Middleware public api ke /api/v1
app.use("/api/v1", Routes);

// Cek apakah fitur autentikasi perlu dihidupkan melalui environment
if (process.env.AUTH_ENABLED == "true") {
  app.use("/api/v1/auth", AuthRoutes.route);
  app.use("/api/v1/users", userRoutes);
}
//  Ekspos route protected (ini harusnya sudah ter-cek oleh auth)
app.use("/api/v1", PrivateRoutes);


//  Return page 404 bila tidak ada endpoint yang dicari

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(404);
  // Validasi apakah request yang datang support html atau enggak
  // bila ya kirim sebuah page, bila tidak maka kirim saja json
  if (req.accepts["html"]) {
    return res.sendFile(path.join(__dirname, "..", "views", "404.html"));
  } else if (req.accepts("json")) {
    return res.json({ error: "404 Not Found" });
  } else {
    res.send("404 Not Found");
  }
});


// Panggil error middleware untuk handling error yang datang
// dan mengirimkannya ke client contoh 500 atau 404 atau 400
app.use(errorMiddleware);
