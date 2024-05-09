import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { cookies } from "next/headers";

import type { AppRouter } from "@thantko/server/src/trpc";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:8080/trpc",
      fetch: globalThis.fetch,
      headers: {
        authorization: `Bearer ${cookies().get("token") || ""}`,
      },
    }),
  ],
});
