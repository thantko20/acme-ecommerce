import { authedProcedure, router } from "../trpc";

export const productsRouter = router({
  list: authedProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany();
    return { data: products };
  }),
});
