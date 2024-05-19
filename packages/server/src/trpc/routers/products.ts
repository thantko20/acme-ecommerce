import { TRPCError } from "@trpc/server";
import slugify from "slugify";

import {
  createProductSchema,
  deleteProductSchema,
  editProductSchema,
  getProductDetailResponse,
  getProductDetailSchema,
  getProductsResponseSchema,
  getProductsSchema,
} from "@thantko/common/validations";

import { adminProcedure, authedProcedure, router } from "../trpc";

export const productsRouter = router({
  list: authedProcedure
    .input(getProductsSchema)
    .output(getProductsResponseSchema)
    .query(async ({ ctx, input }) => {
      const { limit, offset } = input;
      const products = await ctx.prisma.product.findMany({
        skip: offset,
        take: limit,
      });
      return { data: products };
    }),

  create: adminProcedure
    .input(createProductSchema)
    .output(getProductDetailResponse)
    .mutation(async ({ ctx, input }) => {
      const { name, description } = input;
      const productExists = await ctx.prisma.product.findFirst({
        where: {
          name: {
            mode: "insensitive",
            equals: name,
          },
        },
      });
      if (productExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Product with ${name} already exists`,
        });
      }

      const newProduct = await ctx.prisma.product.create({
        data: {
          name,
          description,
          slug: slugify(name, { lower: true }),
        },
      });

      return { data: newProduct };
    }),

  edit: adminProcedure
    .input(editProductSchema)
    .output(getProductDetailResponse)
    .mutation(async ({ ctx, input }) => {
      const { name, description } = input;
      const productExists = await ctx.prisma.product.findFirst({
        where: {
          name: {
            mode: "insensitive",
            equals: name,
          },
          id: {
            not: input.id,
          },
        },
      });
      if (productExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: `Product with ${name} already exists`,
        });
      }

      const updatedProduct = await ctx.prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          name,
          description,
          slug: slugify(name, { lower: true }),
        },
      });

      return { data: updatedProduct };
    }),

  delete: adminProcedure
    .input(deleteProductSchema)
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.id },
      });
      if (!product) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Product does not exists",
        });
      }

      await ctx.prisma.product.delete({ where: { id: product.id } });
      return;
    }),

  byIdOrSlug: authedProcedure
    .input(getProductDetailSchema)
    .output(getProductDetailResponse)
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.product.findFirst({
        where: {
          OR: [
            {
              id: input.id,
            },
            {
              slug: input.id,
            },
          ],
        },
      });
      return { data };
    }),
});
