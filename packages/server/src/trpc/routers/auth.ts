import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { loginSchema, registerSchema } from "@thantko/common/validations";

export const authRouter = router({
  checkForFirstAdmin: publicProcedure.query(async ({ ctx }) => {
    const admin = await ctx.prisma.user.findFirst({ where: { role: "ADMIN" } });

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

      const salt = await bcrypt.genSalt(10);
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
      const admin = await ctx.prisma.user.findUnique({
        where: { email: input.email, role: "ADMIN" },
      });
      if (!admin) {
        throw new TRPCError({
          message: "Invalid credentials.",
          code: "BAD_REQUEST",
        });
      }

      const isValidPw = await bcrypt.compare(input.password, admin.password);
      if (!isValidPw) {
        throw new TRPCError({
          message: "Invalid credentials.",
          code: "BAD_REQUEST",
        });
      }
    }),
});
