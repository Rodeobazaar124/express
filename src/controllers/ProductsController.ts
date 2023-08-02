import { Request, Response } from "express";
import path from "path";
import moment from "moment";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const Products = new PrismaClient().product;

export const createProduct = async (req: any, res: Response) => {
  // Validasi Gambar TerUpload
  if (req.files == null)
    return res.status(400).json({ message: "Gambar harus di upload" });

  // Validasi Data yang sudah ada
  const ProductExist = await Products.count({
    where: {
      title: {
        contains: req.body.title,
      },
    },
  });

  if (ProductExist)
    return res.status(409).json({ error: "Product already exist" });

  // File Handler
  const file = req.files.avatar;
  const filesize = file.data.length;
  const ext = path.extname(file.name);
  const filename = file.md5 + moment().format("DDMMYYY-h_mm_ss") + ext;
  // ${req.protocol}://${req.get("host")}
  const url = `/images/${filename}`;
  const allowedType = [".png", ".jpg"];

  // Validasi File Type
  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ message: `File Type Unsupported` });

  // Validasi ukuran file
  if (filesize > 5000000)
    return res.status(422).json({ message: `File too big` });

  // Menyimpan file
  file.mv(`public/images/${filename}`, async (err: Error) => {
    if (err) return res.status(500).json({ messages: `${err.message}` });

    // Menyimpan nama file beserta data
    try {
      await Products.create({
        data: {
          title: req.body.title,
          image: url,
          desc: req.body.desc,
        },
      });
      res.status(200).json({ message: `Created successfully` });
    } catch (error) {
      res
        .status(500)
        .json({ message: `Error creating Product: ${error.message}` });
    }
  });
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const products = await Products.findMany();
    return res.status(200).json(products);
  } catch (error) {
    console.log(`[ERROR] GetProduct: ${error}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProduct = async (req: any, res: Response) => {
  try {
    // Validate If data exist
    try {
      await Products.findFirst({ where: { id: req.params.id } });
    } catch (error) {
      return res
        .status(400)
        .json({ error: `Data ${req.params.id} Not exist!` });
    }

    // Validate files

    if (req.files == null)
      return res.status(400).json({ message: "Gambar harus di upload" });

    const file = req.files.image;
    const filesize = file.data.length;
    const ext = path.extname(file.name);
    const filename =
      "services" + file.md5 + moment().format("DDMMYYY-h_mm_ss") + ext;
    const url = `${req.protocol}://${
      req.get("host")
      // "192.168.111.48:8000"
    }/images/services/${filename}`;
    const allowedType = [".png", ".jpg", ".svg"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: `File Type Unsupported` });

    if (filesize > 5000000)
      return res.status(422).json({ message: `File too big` });

    file.mv(`public/images/services/${filename}`, async (err: Error) => {
      if (err) return res.status(500).json({ messages: `${err.message}` });
    });
    req.body.image = url;

    // set the data
    const updatedService = Products.update({
      where: { id: req.params.id },
      data: {
        desc: req.body.desc,
        title: req.body.title,
        image: req.body.image,
      },
    });
    return res.status(200).json({ message: "Data Updated Succesfully" });
  } catch (error) {
    console.log(`[ERROR] UpdateService: ${error}`);
    return res.status(500).json({ error: `Cannot Update ${req.params.id}` });
  }
};

export const deleteProduct = async (req: any, res: Response) => {
  try {
    const theProduct = await Products.findFirst({
      where: { id: Number(req.params.id) },
    });
    const file = theProduct.image.split("/");
    console.log(file);
    const filename = file[file.length - 1];
    console.log(filename);
    fs.unlinkSync(`public/images/${filename}`);
    await Products.delete({ where: { id: req.params.id } });
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(`[ERROR] deleteProduct: ${error}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
