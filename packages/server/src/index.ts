import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { createContext } from "./trpc/trpc";
import cookieParser from "cookie-parser";

const app = express();

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