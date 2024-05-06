import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";

export const authRouter = router({
  checkForFirstAdmin: publicProcedure.query(async ({ ctx }) => {
    const admin = await ctx.prisma.user.findFirst({ where: { role: "ADMIN" } });

    return { hasAdmin: Boolean(admin) };
  }),
  registerAdmin: publicProcedure
    .input(
      z
        .object({
          name: z.string(),
          email: z.string().email(),
          password: z.string(),
          confirmPassword: z.string(),
        })
        .refine(
          ({ password, confirmPassword }) => password === confirmPassword,
          "Passwords do not match",
        ),
    )
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
});
