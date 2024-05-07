import { trpc } from "@/lib/trpc";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { User } from "@thantko/common/types";

const TanStackRouterDevtools =
  import.meta.env.PROD ?
    () => null
  : lazy(() =>
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    );

export const Route = createRootRouteWithContext<{
  client: ReturnType<typeof trpc.useUtils>["client"];
  user: User | undefined | null;
}>()({
  component: () => (
    <>
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools initialIsOpen={false} />
      </Suspense>
    </>
  ),
});
