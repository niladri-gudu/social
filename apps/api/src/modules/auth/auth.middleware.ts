import jwt from "jsonwebtoken";

import { FastifyReply, FastifyRequest } from "fastify";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.cookies.accessToken;

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const secret = process.env.JWT_ACCESS_SECRET as string;
    const payload = jwt.verify(token, secret) as unknown as {
      userId: string;
    };

    request.user = payload;
  } catch {
    return reply.code(401).send({ message: "Unauthorized" });
  }
}
