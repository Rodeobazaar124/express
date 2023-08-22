import crypto from "crypto";

export const hashToken = function (token: string) {
  return crypto.createHash("sha512").update(token).digest("hex");
};
