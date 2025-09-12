import { decode } from "next-auth/jwt";
import { getToken } from "next-auth/jwt";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { auth } from "./middleware";
dotenv.config();

const app = express();
// asdfadf asdfasdfasdf sadfasdfasdf

app.use(cookieParser());

const port = 3001;

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/", auth, async (req: Request, res: Response) => {
  try {
    res.send({ message: "Hello World" });
  } catch (error) {
    console.error(error);
    res.send({ error: error });
  }
});

app.get("/session", async (req: Request, res: Response) => {
  try {
    console.log("req.headers", req.headers);
    const token = await getToken({
      req: {
        headers: {
          ...(req.headers as Record<string, string>),
          cookie:
            req.headers.cookie || req.cookies
              ? Object.entries(req.cookies)
                  .map(([k, v]) => `${k}=${v}`)
                  .join("; ")
              : "",
        },
      },
      cookieName: "authjs.session-token",
      secureCookie: false,
      secret: "T/tLgjjRPdukHenw92N86yA6vbS/M6I+0AbbxtFxCoI=",
    });
    res.send({ token });
  } catch (error) {
    console.error(error);
    res.send({ error: error });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
