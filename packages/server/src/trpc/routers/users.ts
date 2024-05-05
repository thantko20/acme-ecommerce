import { publicProcedure, router } from "../trpc";

export const usersRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    console.log(ctx.req.headers.authorization);
    const prisma = ctx.prisma;

    return prisma.user.findMany();
  }),
  create: publicProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.create({
      data: {
        email: "smilenwesoe@gmail.com",
        name: "Han Nwe Soe",
      },
    });
    console.log("User created");
    return user;
  }),
});
