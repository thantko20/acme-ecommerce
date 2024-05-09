import { TRPCError, initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import jwt from "jsonwebtoken";

import { JwtPayload, User, roles } from "@thantko/common/types";

import { prisma } from "../prisma";

const getUser = (token: string): Promise<User | null> =>
  new Promise((resolve) => {
    jwt.verify(
      token,
      "secret",
      async (error: unknown, decoded: JwtPayload | unknown) => {
        if (error) {
          return resolve(null);
        }

        const { user: payloadUser } = decoded as JwtPayload;

        const user = await prisma.user.findUnique({
          where: { id: payloadUser.id },
          omit: {
            password: true,
            salt: true,
          },
        });
        resolve(user);
      },
    );
  });

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  let user: User | null = null;
  const token = req.cookies.token;
  if (token) {
    user = await getUser(token);
  }
  return {
    req,
    res,
    prisma,
    user,
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
