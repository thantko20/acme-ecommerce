import { TRPCError, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import dayjs from "dayjs";

import { roles } from "@thantko/common/types";

import { SESSION_ID_KEY } from "../constants";
import { prisma } from "../prisma";
import { getSessionId } from "../utils/auth";

const getSession = async (
  req: trpcExpress.CreateExpressContextOptions["req"],
) => {
  const sessionId = getSessionId(req);
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    relationLoadStrategy: "join",
    where: {
      sessionId,
    },
    include: {
      user: {
        omit: {
          password: true,
          salt: true,
        },
      },
    },
  });

  return session;
};

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  const session = await getSession(req);
  return {
    req,
    res,
    prisma,
    session,
    user: session?.user || null,
  };
};
type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  errorFormatter(opts) {
    console.log(opts.error);
    return opts.error;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure.use(async ({ next, path, type }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;
  result.ok ?
    console.log("OK request timing:", { path, type, durationMs })
  : console.log("Non-OK request timing", { path, type, durationMs });
  return result;
});
export const authedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const unauthorizedError = new TRPCError({ code: "UNAUTHORIZED" });
  const { user, session, prisma, res } = ctx;
  if (!session || !user) {
    throw unauthorizedError;
  }

  if (dayjs().isAfter(session.expiresAt)) {
    await prisma.session.delete({
      where: {
        sessionId: session.sessionId,
      },
    });
    res.clearCookie(SESSION_ID_KEY);
    throw unauthorizedError;
  }

  return next({
    ctx: {
      ...ctx,
      user,
      session,
    },
  });
});
export const adminProcedure = authedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== roles.ADMIN) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next();
});
