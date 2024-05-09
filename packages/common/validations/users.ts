import { z } from "zod";

import { paginationSchema } from "./helpers";

export const getUsersSchema = paginationSchema.merge(
  z.object({
    name: z.string().optional(),
  }),
);

export type GetUsersSchema = z.infer<typeof getUsersSchema>;
