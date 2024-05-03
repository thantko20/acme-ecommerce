import { publicProcedure, router } from "../trpc";

export const usersRouter = router({
  list: publicProcedure.query(async () => {
    return [
      {
        id: 1,
        name: "Thant Ko",
      },
    ];
  }),
});
