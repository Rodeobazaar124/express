export enum Action {
  GET = "get",
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}

import { Prisma } from "@prisma/client";
import { db } from "../app/database";
import { ResponseError } from "../error/response-error";

export const checkExistsThrow = async (
  tableName: Prisma.ModelName,
  column: string,
  whatToParse: any,
  whatYouAreDoing: Action
) => {
  const table = db[tableName];
  column.toLowerCase() == "id" ? (whatToParse = parseInt(whatToParse)) : "";
  const result = await table.findFirst({
    where: {
      [column]: whatToParse,
    },
  });
  if (result === null) {
    if (
      whatYouAreDoing === Action.GET ||
      whatYouAreDoing === Action.UPDATE ||
      whatYouAreDoing === Action.DELETE
    ) {
      const msg = `CANNOT ${whatYouAreDoing} DATA. DATA ${column} ${whatToParse} NOT FOUND`;
      throw new ResponseError(404, msg.toUpperCase());
    }
    return result;
  } else {
    if (whatYouAreDoing === Action.CREATE) {
      throw new ResponseError(
        409,
        `${column.toUpperCase()} WITH VALUE '${whatToParse}' ALREADY EXISTS`
      );
    }
    return result;
  }
};
