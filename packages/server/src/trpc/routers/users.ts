import { Prisma } from "@prisma/client";

import { roles } from "@thantko/common/types";
import { getUsersSchema } from "@thantko/common/validations";

import { adminProcedure, router } from "../trpc";

export const usersRouter = router({
  listCustomers: adminProcedure
    .input(getUsersSchema)
    .query(async ({ ctx, input }) => {
      const { limit, name, offset } = input;
      const where: Prisma.UserWhereInput = { role: roles.USER };
      if (name) {
        where.name = {
          contains: name,
        };
      }
      const prisma = ctx.prisma;

      return prisma.user.findMany({
        where,
        skip: offset,
        take: limit,
      });
    }),
});
