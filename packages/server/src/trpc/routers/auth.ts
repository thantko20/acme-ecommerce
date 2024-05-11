import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import crypto from "node:crypto";

import { roles } from "@thantko/common/types";
import { loginSchema, registerSchema } from "@thantko/common/validations";

import { SESSION_ID_KEY } from "../../constants";
import { getSessionId } from "../../utils/auth";
import { adminProcedure, publicProcedure, router } from "../trpc";

const generateToken = (size: number = 15) => {
  const bytes = crypto.randomBytes(size);
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
      const { email, name, password } = input;
      const emailExists = await ctx.prisma.user.findUnique({
        where: { email },
      });
      if (emailExists) {
        throw new TRPCError({
          message: "Email already exists",
          code: "CONFLICT",
        });
      }

      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hashedPw = await bcrypt.hash(password, salt);

      return ctx.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPw,
          salt,
          role: roles.ADMIN,
        },
        omit: {
          password: true,
          salt: true,
        },
      });
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
    await ctx.prisma.session.delete({
      where: {
        sessionId: getSessionId(ctx.req),
      },
    });
    ctx.res.clearCookie(SESSION_ID_KEY);
  }),

  adminMe: adminProcedure.query(async ({ ctx }) => {
    return { user: ctx.user };
  }),
});
