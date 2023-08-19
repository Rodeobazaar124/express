import { PrismaClient } from "@prisma/client";
import { logger } from "./logging";

export const prismaClient = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
  errorFormat: "pretty",
});

prismaClient.$on("error", (e) => {
  logger.error(e);
});

prismaClient.$on("warn", (w) => {
  logger.warn(w);
});

prismaClient.$on("info", (i) => {
  logger.info(i);
});

prismaClient.$on("query", (q) => {
  logger.info(q);
});