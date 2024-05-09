import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { JwtPayload, roles } from "@thantko/common/types";
import { loginSchema, registerSchema } from "@thantko/common/validations";

import { adminProcedure, publicProcedure, router } from "../trpc";

const SALT_ROUNDS = 10;

const signJwt = (payload: JwtPayload): Promise<string> =>
  new Promise((resolve, reject) =>
    jwt.sign(payload, "secret", (error, encoded) => {
      if (error) return reject(error);
      resolve(encoded as string);
    }),
  );

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
          role: "ADMIN",
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
        message: "Invalid credentials.",
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
      const { password: _pw, salt: _salt, ...user } = admin;
      const token = await signJwt({ user, type: roles.ADMIN });
      ctx.res.cookie("token", token);
      return { token, user };
    }),
  logoutAdmin: publicProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie("token");
  }),

  adminMe: adminProcedure.query(async ({ ctx }) => {
    return { user: ctx.user };
  }),
});
