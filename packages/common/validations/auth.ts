import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine(
    ({ password, confirmPassword }) => password === confirmPassword,
    "Passwords do not match",
  );

export type RegisterSchema = z.infer<typeof registerSchema>;
