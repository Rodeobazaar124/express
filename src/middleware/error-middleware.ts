import { NextFunction, Response } from "express";
import { logger } from "../app/logging";

export const errorMiddleware = async (
  err: any,
  req: Request | any,
  res: Response | any,
  next: NextFunction | any
) => {
  if (!err) {
    next();
    return;
  }

  if (err.status) {
    const status = err.status;
    res
      .status(status)
      .json({
        errors: err.message,
      })
      .end();
  } else {
    const status = 500;
    logger.error(err.message);
    res
      .status(status)
      .json({
        errors: err.message,
      })
      .end();
  }
};
