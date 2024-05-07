import { z } from "zod";
import { emailSchema, passwordSchema } from "./helpers";

export const registerSchema = z
  .object({
    name: z.string(),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(
    ({ password, confirmPassword }) => password === confirmPassword,
    "Passwords do not match",
  );

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginSchema = z.infer<typeof loginSchema>;
