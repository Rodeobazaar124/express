import { logger } from "../core/logging";
import { ResponseError } from "../error/response-error";

export const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json({
        errors: err.message,
      })
      .end();
  } else {
    logger.error(`\n ${err} \n`);
    res
      .status(500)
      .json({
        errors: err.message,
      })
      .end();
  }
};
