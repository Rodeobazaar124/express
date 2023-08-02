import { Request, Response } from "express";
import path from "path";
import moment from "moment";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
const Testimonies = new PrismaClient({ errorFormat: "minimal" }).testimony;

export const createTestimony = async (req: any, res: Response) => {
  // Memecah data

  // Cek apakah ada gambar di request
  if (req.files == null)
    return res.status(400).json({ message: "Gambar harus di upload" });

  if (!req.body.username)
    return res.status(409).json("username must available");

  const TestimonyExist = await Testimonies.count({
    where: { username: req.body.username },
  });
  if (TestimonyExist)
    return res
      .status(409)
      .json("Comment already exist or Fields isn't complete");

  const file = req.files.avatar;
  const filesize = file.data.length;
  const ext = path.extname(file.name);
  const filename = file.md5 + moment().format("DDMMYYY-h_mm_ss") + ext;
  const url = `${req.protocol}://${req.get("host")}/images/${filename}`;
  const allowedType = [".png", ".jpg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ message: `File Type Unsupported` });

  if (filesize > 5000000)
    return res.status(422).json({ message: `File too big` });

  file.mv(`public/images/${filename}`, async (err: Error) => {
    if (err) return res.status(500).json({ messages: `${err.message}` });

    try {
      await Testimonies.create({
        data: {
          username: req.body.username,
          location: req.body.location,
          comment: req.body.comment,
          star: parseFloat(req.body.star),
          avatar: url,
        },
      });
      res.status(200).json({ message: `Created successfully` });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error creating Testimony: ${error.message}` });
    }
  });
};

export const getTestimony = async (req: Request, res: Response) => {
  try {
    const Testimonys = await Testimonies.findMany();
    return res.status(200).send(Testimonys);
  } catch (error) {
    console.log(`[ERROR] GetTestimony: ${error}`);
    return res.status(500).send("Internal Server Error");
  }
};

export const updateTestimony = async (req: Request, res: Response) => {
  try {
    const updatedTestimony = await Testimonies.update({
      where: { id: Number(req.params.id) },
      data: {
        username: req.body.username,
        comment: req.body.username,
        location: req.body.location,
        star: req.body.star,
      },
    });
    return res.status(200).json(updatedTestimony);
  } catch (error) {
    console.log(`[ERROR] UpdateTestimony: ${error}`);
    throw error;
  }
};

export const deleteTestimony = async (req: any, res: Response) => {
  try {
    const Testimony = await Testimonies.findFirst({
      where: { id: Number(req.params.id) },
    });
    const file = Testimony.avatar.split("/");
    console.log(file);
    const filename = file[file.length - 1];
    console.log(filename);
    fs.unlinkSync(`public/images/${filename}`);
    await Testimonies.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(`[ERROR] deleteTestimony: ${error}`);
    return res.status(500).send("Internal Server Error");
  }
};
