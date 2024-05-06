import { z } from "zod";

export const passwordSchema = z.string();

export type PasswordSchema = z.infer<typeof passwordSchema>;
