import { attributesRouter } from "./routers/attributes";
import { authRouter } from "./routers/auth";
import { productsRouter } from "./routers/products";
import { usersRouter } from "./routers/users";
import { router } from "./trpc";

export const appRouter = router({
  user: usersRouter,
  auth: authRouter,
  product: productsRouter,
  attribute: attributesRouter,
});

export type AppRouter = typeof appRouter;
