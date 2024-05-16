import { TRPCError } from "@trpc/server";
import slugify from "slugify";

import {
  createAttributeSchema,
  editAttributeSchema,
  getAttributeByIdOrNameSchema,
} from "@thantko/common/validations";

import { adminProcedure, publicProcedure, router } from "../trpc";

export const attributesRouter = router({
  create: adminProcedure
    .input(createAttributeSchema)
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
            AND: [
              {
                attributeId: input.id,
              },
              {
                name: {
                  notIn: input.values.map((value) => value.name),
                },
              },
            ],
          },
        });

        return tx.attribute.update({
          where: {
            id: input.id,
          },
          data: {
            name: input.name,
            slug: slugify(input.name, { lower: true }),
            values: {
              createMany: {
                data: input.values,
                skipDuplicates: true,
              },
            },
          },
          include: {
            values: true,
          },
        });
      });
      return { data };
    }),

  list: publicProcedure.query(async ({ ctx }) => {
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
    .input(getAttributeByIdOrNameSchema)
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
