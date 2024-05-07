import { publicProcedure, router } from "../trpc";

export const usersRouter = router({
  listCustomers: publicProcedure.query(async ({ ctx }) => {
    console.log(ctx.req.cookies.token);
    const prisma = ctx.prisma;

    return prisma.user.findMany({ where: { role: "USER" } });
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
