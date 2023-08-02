import { Request, Response } from "express";
import path from "path";
import moment from "moment";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const Services = new PrismaClient().service;

export const createService = async (req: any, res: Response) => {
  if (req.files == null)
    return res.status(400).json({ message: "Gambar harus di upload" });

  const ServiceExist = await Services.count({
    where: { title: req.body.title },
  });
  if (ServiceExist) return res.status(409).json("Service already exist");
  const file = req.files.logo;
  const filesize = file.data.length;
  const ext = path.extname(file.name);
  const filename =
    "services" + file.md5 + moment().format("DDMMYYY-h_mm_ss") + ext;
  const url = `${req.protocol}://${
    // req.get(
    // "host")
    "192.168.111.48:8000"
  }/images/services/${filename}`;
  const allowedType = [".png", ".jpg", ".svg"];

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ message: `File Type Unsupported` });

  if (filesize > 5000000)
    return res.status(422).json({ message: `File too big` });

  file.mv(`public/images/services/${filename}`, async (err: Error) => {
    if (err) return res.status(500).json({ messages: `${err.message}` });

    try {
      if (req.body.desc) {
        await Services.create({
          data: {
            title: req.body.title,
            desc: req.body.desc,
            link: req.body.link,
            logo: url,
          },
        });
        res.status(200).json({ message: `Created successfully` });
      } else {
        await Services.create({
          data: { title: req.body.title, link: req.body.link, logo: url },
        });
        res.status(200).json({ message: `Created successfully` });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error creating Service: ${error.message}` });
    }
  });
};

export const getService = async (req: Request, res: Response) => {
  try {
    const services = await Services.findMany();
    return res.status(200).json(services);
  } catch (error) {
    console.log(`[ERROR] GetService: ${error}`);
    return res.status(500).json("Internal Server Error");
  }
};

export const updateService = async (req: any, res: Response) => {
  try {
    // Validate If data exist
    try {
      await Services.count({ where: { id: req.params.id } });
    } catch (error) {
      return res
        .status(400)
        .json({ error: `Data ${req.params.id} Not exist!` });
    }

    // Validate files

    if (req.files == null)
      return res.status(400).json({ message: "Gambar harus di upload" });

    const file = req.files.logo;
    const filesize = file.data.length;
    const ext = path.extname(file.name);
    const filename =
      "services" + file.md5 + moment().format("DDMMYYY-h_mm_ss") + ext;
    const url = `${req.protocol}://${
      // req.get(
      // "host")
      "192.168.111.48:8000"
    }/images/services/${filename}`;
    const allowedType = [".png", ".jpg", ".svg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: `File Type Unsupported` });

    if (filesize > 5000000)
      return res.status(422).json({ message: `File too big` });

    file.mv(`public/images/services/${filename}`, async (err: Error) => {
      if (err) return res.status(500).json({ messages: `${err.message}` });
    });

    req.body.logo = url;

    // set the data
    const updatedService = Services.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
    return res.status(200).json({ message: "Data Updated Succesfully" });
  } catch (error) {
    console.log(`[ERROR] UpdateService: ${error}`);
    return res.status(500).json({ error: `Cannot Update ${req.params.id}` });
  }
};

export const deleteService = async (req: any, res: Response) => {
  try {
    const theService = await Services.findFirst({
      where: {
        id: req.params.id,
      },
    });
    const file = theService.logo.split("/");
    console.log(file);
    const filename = file[file.length - 1];
    console.log(filename);
    fs.unlinkSync(`public/images/services/${filename}`);
    await Services.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(`[ERROR] deleteService: ${error}`);
    return res.status(500).send("Internal Server Error");
  }
};
