import { z } from "zod";

export const createAttributeSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name must have at least 1 character"),
  values: z
    .array(
      z.object({
        name: z.string().min(1, "Value must have at least 1 character"),
      }),
    )
    .min(1, "Must have at least 1 value"),
});

export type CreateAttributeSchema = z.infer<typeof createAttributeSchema>;
