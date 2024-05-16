import { z } from "zod";

import { paginationSchema } from "./helpers";

export const attributeItemSchema = z.object({
  id: z.string(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  name: z.string(),
  slug: z.string(),
  values: z.array(
    z.object({
      id: z.string(),
      createdAt: z.string().or(z.date()),
      updatedAt: z.string().or(z.date()),
      name: z.string(),
    }),
  ),
});

export type AttributeItem = z.infer<typeof attributeItemSchema>;

export const createAttributeSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name must have at least 1 character"),
  values: z
    .array(
      z.object({
        name: z.string().min(1, "Value must have at least 1 character"),
        id: z.string().optional(),
      }),
    )
    .min(1, "Must have at least 1 value"),
});

export type CreateAttributeSchema = z.infer<typeof createAttributeSchema>;

export const editAttributeSchema = createAttributeSchema.merge(
  z.object({
    id: z.string({ required_error: "ID is required" }),
  }),
);
export type EditAttributeSchema = z.infer<typeof editAttributeSchema>;

export const getAttributesSchema = paginationSchema;
export type GetAttributesSchema = z.infer<typeof getAttributesSchema>;

export const getAttributeByIdOrSlugSchema = z.object({
  id: z.string({ required_error: "ID or Slug is required" }),
});

export type GetAttributeByIdOrSlugSchema = z.infer<
  typeof getAttributeByIdOrSlugSchema
>;

export const getAttributesResponseSchema = z.object({
  data: z.array(attributeItemSchema),
});
export type GetAttributesResponse = z.infer<typeof getAttributesResponseSchema>;

export const getAttributeDetailResponseSchema = z.object({
  data: attributeItemSchema.nullable(),
});
export type GetAttributeDetailResponse = z.infer<
  typeof getAttributeDetailResponseSchema
>;
