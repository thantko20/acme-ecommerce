import { z } from "zod";

import { paginationSchema } from "./helpers";

export const productItemSchema = z.object({
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
  id: z.string(),
  name: z.string(),
  description: z.string(),
  slug: z.string(),
});

export type ProductItem = z.infer<typeof productItemSchema>;

export const getProductsResponseSchema = z.object({
  data: z.array(productItemSchema),
});

export type GetProductsResponse = z.infer<typeof getProductsResponseSchema>;

export const getProductsSchema = paginationSchema;
export type GetProductsSchema = z.infer<typeof getProductsSchema>;
