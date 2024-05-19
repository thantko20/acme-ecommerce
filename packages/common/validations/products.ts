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

export const getProductDetailResponse = z.object({
  data: productItemSchema.nullable(),
});
export type GetProductDetailResponse = z.infer<typeof getProductDetailResponse>;

export const createProductSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  description: z.string().default(""),
  attributes: z.array(
    z.object({
      attributeId: z.string(),
    }),
  ),
});
export type CreateProductSchema = z.infer<typeof createProductSchema>;

export const editProductSchema = createProductSchema.and(
  z.object({
    id: z.string({ required_error: "ID is required" }),
  }),
);
export type EditProductSchema = z.infer<typeof editProductSchema>;

export const deleteProductSchema = z.object({
  id: z.string({ required_error: "ID is required" }).min(1, "ID is required"),
});
export type DeleteProductSchema = z.infer<typeof deleteProductSchema>;

export const getProductDetailSchema = z.object({
  id: z.string(),
});
