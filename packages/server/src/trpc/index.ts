import { usersRouter } from "./routers/users";
import { router } from "./trpc";

export const appRouter = router({
  user: usersRouter,
});

export type AppRouter = typeof appRouter;
