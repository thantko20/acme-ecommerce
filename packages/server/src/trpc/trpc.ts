import { TRPCError, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

import { roles } from "@thantko/common/types";

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

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const authedProcuedure = publicProcedure.use(({ ctx, next }) => {
  const { user } = ctx;
  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
export const adminProcedure = authedProcuedure.use(({ ctx, next }) => {
  if (ctx.user.role !== roles.ADMIN) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }

  return next();
});
