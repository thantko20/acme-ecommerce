import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { appRouter } from "./trpc";
import { createContext } from "./trpc/trpc";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);
app.use(cookieParser());

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.get("/", (req, res) => {
  res.send("Hello!");
});

(async function () {
  app.listen(8080, () => console.log("listening on port :8080"));
})();
