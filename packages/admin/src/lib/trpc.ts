import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@thantko/server/src/trpc";

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "http://localhost:8080/trpc",
      fetch(url, opts) {
        return window.fetch(url, { ...opts, credentials: "include" });
      },
    }),
  ],
});
