import { z } from "zod";

import { paginationSchema } from "./helpers";

export const userWithCredentialsSchema = z.object({
  id: z.string(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),

  name: z.string(),
  email: z.string(),
  password: z.string(),
  salt: z.string(),
});
export type UserWithCredentials = z.infer<typeof userWithCredentialsSchema>;

export const userSchema = userWithCredentialsSchema.omit({
  password: true,
  salt: true,
});
export type User = z.infer<typeof userSchema>;

export const getUsersSchema = paginationSchema.and(
  z.object({
    name: z.string().optional(),
  }),
);

export type GetUsersSchema = z.infer<typeof getUsersSchema>;
