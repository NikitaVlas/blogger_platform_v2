import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../core/types/http-statuses";
import { usersRepository } from "../../../composition-root/container";
import { jwtService } from "../../../composition-root/container";
import { AuthRequest } from "../types/auth-request";

export const bearerAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const payload = jwtService.verifyAccessToken(token);

  if (!payload) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const user = await usersRepository.findById(payload.userId);

  if (!user) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  (req as AuthRequest).user = user;

  next();
};
