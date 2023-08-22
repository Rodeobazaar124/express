import { PrismaClient } from "@prisma/client";
import { logger } from "./logging";

export const db = new PrismaClient({
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
  errorFormat: "minimal",
});

db.$on("error", (e) => {
  logger.error(e);
});

db.$on("warn", (w) => {
  logger.warn(w);
});

db.$on("info", (i) => {
  logger.info(i);
});

db.$on("query", (q) => {
  logger.info(q);
});
