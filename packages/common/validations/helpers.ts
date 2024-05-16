import { z } from "zod";

import { calculatePaginationOffset } from "../utils";

export const emailSchema = z.string({
  invalid_type_error: "Invalid email",
  required_error: "Email is required",
});

export type EmailSchema = z.infer<typeof emailSchema>;

export const passwordSchema = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Password is required",
  })
  .min(6, "Please input at least 6 minimum characters")
  .max(16, "Maximum characters is 16");

export type PasswordSchema = z.infer<typeof passwordSchema>;

export const paginationSchema = z
  .object({
    page: z.number().nonnegative().catch(1),
    limit: z.number().nonnegative().catch(10),
  })
  .transform(({ page, limit }) => ({
    page,
    offset: calculatePaginationOffset(page, limit),
    limit,
  }));

export type PaginationSchema = z.infer<typeof paginationSchema>;
