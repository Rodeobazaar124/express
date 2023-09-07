import { db } from "../app/database";
import { hashToken } from "../app/jwt";
export const addRefreshTokenToWhitelist = function ({
  jti,
  refreshToken,
  userId,
}) {
  return db.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
};

// used to check if the token sent by the client is in the database.
export const findRefreshTokenById = function (id: string | any) {
  return db.refreshToken.findUnique({
    where: {
      id,
    },
  });
};

// soft delete tokens after usage.
export const deleteRefreshToken = function (id: string | any) {
  return db.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
};

export const revokeTokens = function (userId: string | String | any) {
  return db.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
};
