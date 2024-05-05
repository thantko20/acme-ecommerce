import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@thantko/server/src/trpc";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:8080/trpc",
    }),
  ],
});
