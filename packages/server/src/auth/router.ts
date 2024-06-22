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

const generateToken = (byteSize: number = 15) => {
  const bytes = crypto.randomBytes(byteSize);
  return Buffer.from(bytes).toString("base64");
};

const SALT_ROUNDS = 10;

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
      const loginError = new TRPCError({
        message: "Invalid email or password.",
        code: "BAD_REQUEST",
      });

      const admin = await ctx.prisma.user.findUnique({
        where: { email: input.email, role: roles.ADMIN },
      });
      if (!admin) {
        throw loginError;
      }

      const isValidPw = await bcrypt.compare(input.password, admin.password);
      if (!isValidPw) {
        throw loginError;
      }

      const sessionId = generateToken(15);
      const expiresAt = dayjs().add(30, "days").toDate();
      await ctx.prisma.session.create({
        data: {
          expiresAt,
          sessionId,
          userId: admin.id,
        },
      });

      const { password: _pw, salt: _salt, ...user } = admin;
      ctx.res.cookie("sid", sessionId, {
        expires: expiresAt,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      return { user };
    }),
  logoutAdmin: publicProcedure.mutation(async ({ ctx }) => {
    if (ctx.session?.sessionId) {
      await ctx.prisma.session.delete({
        where: {
          sessionId: ctx.session?.sessionId,
        },
      });
    }
    ctx.res.clearCookie(SESSION_ID_KEY);
  }),

  adminMe: adminProcedure.query(async ({ ctx }) => {
    return { user: ctx.user };
  }),
});
