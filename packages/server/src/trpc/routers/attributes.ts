import { TRPCError } from "@trpc/server";
import slugify from "slugify";

import {
  createAttributeSchema,
  editAttributeSchema,
  getAttributeByIdOrSlugSchema,
  getAttributeDetailResponseSchema,
  getAttributesResponseSchema,
  getAttributesSchema,
} from "@thantko/common/validations";

import { adminProcedure, publicProcedure, router } from "../trpc";

export const attributesRouter = router({
  create: adminProcedure
    .input(createAttributeSchema)
    .output(getAttributeDetailResponseSchema)
    .mutation(async ({ ctx, input }) => {
      const attributeExists = await ctx.prisma.attribute.findFirst({
        where: {
          name: {
            mode: "insensitive",
            equals: input.name,
          },
        },
      });
      if (attributeExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Attribute already exists",
        });
      }

      const newAttribute = await ctx.prisma.attribute.create({
        data: {
          name: input.name,
          slug: slugify(input.name, { lower: false }),
          values: {
            createMany: {
              data: input.values,
            },
          },
        },
        include: {
          values: true,
        },
      });
      return { data: newAttribute };
    }),

  edit: adminProcedure
    .input(editAttributeSchema)
    .output(getAttributeDetailResponseSchema)
    .mutation(async ({ ctx, input }) => {
      const attributeExists = await ctx.prisma.attribute.findFirst({
        where: {
          AND: [
            {
              name: {
                mode: "insensitive",
                equals: input.name,
              },
            },
            {
              NOT: {
                id: input.id,
              },
            },
          ],
        },
      });

      if (attributeExists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Attribute already exists",
        });
      }

      const data = await ctx.prisma.$transaction(async (tx) => {
        await tx.attributeValue.deleteMany({
          where: {
            attributeId: input.id,
            id: {
              notIn: input.values
                .filter((value) => Boolean(value.id))
                .map((value) => value.id) as string[],
            },
          },
        });
        await Promise.all(
          input.values.map((value) =>
            tx.attributeValue.upsert({
              where: {
                id: value.id || "",
              },
              create: {
                name: value.name,
                attributeId: input.id,
              },
              update: {
                name: value.name,
              },
            }),
          ),
        );
        return tx.attribute.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            slug: slugify(input.name, { lower: true }),
          },
          include: {
            values: true,
          },
        });
      });
      return { data };
    }),

  list: publicProcedure
    .input(getAttributesSchema)
    .output(getAttributesResponseSchema)
    .query(async ({ ctx }) => {
      const data = await ctx.prisma.attribute.findMany({
        include: {
          values: true,
        },
        orderBy: {
          name: "asc",
        },
      });
      return { data };
    }),

  byIdOrSlug: publicProcedure
    .input(getAttributeByIdOrSlugSchema)
    .output(getAttributeDetailResponseSchema)
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.attribute.findFirst({
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
        include: {
          values: true,
        },
      });
      return { data };
    }),
});
