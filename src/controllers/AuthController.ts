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
export const findRefreshTokenById = function (id) {
  return db.refreshToken.findUnique({
    where: {
      id,
    },
  });
};

// soft delete tokens after usage.
export const deleteRefreshToken = function (id) {
  return db.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
};

export const revokeTokens = function (userId) {
  return db.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
};
