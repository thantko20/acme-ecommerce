import {
  getProductsResponseSchema,
  getProductsSchema,
} from "@thantko/common/validations";

import { authedProcedure, router } from "../trpc";

export const productsRouter = router({
  list: authedProcedure
    .input(getProductsSchema)
    .output(getProductsResponseSchema)
    .query(async ({ ctx }) => {
      const products = await ctx.prisma.product.findMany();
      return { data: products };
    }),
});
