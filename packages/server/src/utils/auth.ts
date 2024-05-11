import * as trpcExpress from "@trpc/server/adapters/express";

import { SESSION_ID_KEY } from "../constants";

export const getSessionId = (
  req: trpcExpress.CreateExpressContextOptions["req"],
) => {
  return typeof req.cookies[SESSION_ID_KEY] === "string" ?
      req.cookies[SESSION_ID_KEY]
    : undefined;
};
