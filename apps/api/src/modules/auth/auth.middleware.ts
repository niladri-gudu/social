import jwt from "jsonwebtoken";

import { FastifyReply, FastifyRequest } from "fastify";

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.code(401).send({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return reply.code(401).send({ message: "Unauthorized" });
  }

  try {
    const secret = process.env.JWT_ACCESS_SECRET as string;
    console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET);
    const payload = jwt.verify(token, secret) as unknown as {
      userId: string;
    };

    request.user = payload;
  } catch {
    return reply.code(401).send({ message: "Unauthorized" });
  }
}
