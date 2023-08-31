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
      throw new ResponseError(
        404,
        `CANNOT ${whatYouAreDoing.toUpperCase()} DATA. DATA ${column.toUpperCase()} ${whatToParse} NOT FOUND`
      );
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
