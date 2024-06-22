import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import crypto from "node:crypto";

import { roles } from "@thantko/common/types";
import { loginSchema, registerSchema } from "@thantko/common/validations";

import { SESSION_ID_KEY } from "../constants";
import { adminProcedure, publicProcedure, router } from "../trpc/trpc";
import { makeUsersRepository } from "../users/repository";
import { makeCreateAdmin } from "../users/service";
import {
  makeCreateAdminSession,
  makeLoginAdmin,
  makeLogoutAdmin,
} from "./service";
import { makeSessionRepository } from "./session-repository";

export const authRouter = router({
  checkForFirstAdmin: publicProcedure.query(async ({ ctx }) => {
    const admin = await ctx.prisma.user.findFirst({
      where: { role: roles.ADMIN },
    });

    return { hasAdmin: Boolean(admin) };
  }),
  registerAdmin: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const createAdmin = makeCreateAdmin({
        userRepository: makeUsersRepository(ctx.prisma),
      });
      const admin = await createAdmin(input);
      return admin;
    }),

  loginAdmin: publicProcedure
    .input(loginSchema)
    .mutation(async ({ ctx, input }) => {
      const loginAdmin = makeLoginAdmin({
        userRepo: makeUsersRepository(ctx.prisma),
      });
      const createAdminSession = makeCreateAdminSession({
        sessionRepo: makeSessionRepository(ctx.prisma),
      });

      const admin = await loginAdmin(input);
      const session = await createAdminSession(admin.id);

      const { password: _pw, salt: _salt, ...user } = admin;
      ctx.res.cookie("sid", session.sessionId, {
        expires: session.expiresAt,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      return { user };
    }),
  logoutAdmin: publicProcedure.mutation(async ({ ctx }) => {
    const logoutAdmin = makeLogoutAdmin({
      sessionRepo: makeSessionRepository(ctx.prisma),
    });
    await logoutAdmin(ctx.session);
    ctx.res.clearCookie(SESSION_ID_KEY);
  }),

  adminMe: adminProcedure.query(async ({ ctx }) => {
    return { user: ctx.user };
  }),
});
