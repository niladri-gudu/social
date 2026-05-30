import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (sessionId: string) => {
  return jwt.sign({ sessionId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"],
  });
};
