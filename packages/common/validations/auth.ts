import { z } from "zod";
import { passwordSchema } from "./helpers";

export const registerSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(
    ({ password, confirmPassword }) => password === confirmPassword,
    "Passwords do not match",
  );

export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export type LoginSchema = z.infer<typeof loginSchema>;
