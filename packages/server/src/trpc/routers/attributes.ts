import { TRPCError } from "@trpc/server";

import { createAttributeSchema } from "@thantko/common/validations";

import { adminProcedure, router } from "../trpc";

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

  list: adminProcedure.query(async ({ ctx }) => {
    const data = await ctx.prisma.attribute.findMany({
      include: {
        values: true,
      },
    });
    return { data };
  }),
});
