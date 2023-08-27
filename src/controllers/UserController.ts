import bcrypt from "bcrypt";
import { db } from "../app/database";

export const findUserByEmail = function (email) {
  return db.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUserByEmailAndPassword = function (user) {
  user.password = bcrypt.hashSync(user.password, 12);
  return db.user.create({
    data: user,
  });
};

export const findUserById = function (id) {
  return db.user.findUnique({
    where: {
      id,
    },
  });
};
