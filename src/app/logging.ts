import winston from "winston";


// Instansiasi logger dari winston
export const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [new winston.transports.Console({})],
});
