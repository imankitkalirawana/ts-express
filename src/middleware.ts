// middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { decode } from "next-auth/jwt";

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sessionToken = req.cookies["authjs.session-token"];
    const secret = process.env.NEXTAUTH_SECRET as string;
    if (!sessionToken || !secret) {
      res.status(401).json({ error: "Unauthorized - No session token" });
      return;
    }

    const decoded = await decode({
      token: sessionToken,
      secret,
      salt: "authjs.session-token",
    });

    if (!decoded) {
      res.status(401).json({ error: "Unauthorized - Invalid token" });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    // console.error("Authentication error:", error);
    res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};
