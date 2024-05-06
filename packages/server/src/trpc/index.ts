import { authRouter } from "./routers/auth";
import { usersRouter } from "./routers/users";
import { router } from "./trpc";

export const appRouter = router({
  user: usersRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
