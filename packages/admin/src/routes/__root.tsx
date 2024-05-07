import { trpc } from "@/lib/trpc";
import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { useAuthStore } from "@/components/auth-provider";
import { Route as LoginRoute } from "./_auth/auth/login";
import { Route as RegisterRoute } from "./_auth/auth/register";

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
  auth: Pick<ReturnType<typeof useAuthStore>, "user" | "isAuthenticated">;
}>()({
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated) {
      return {
        ...context,
        auth: {
          ...context.auth,
          user: context.auth.user!,
        },
      };
    }

    const { hasAdmin } = await context.client.auth.checkForFirstAdmin.query();
    const to = hasAdmin ? LoginRoute.fullPath : RegisterRoute.fullPath;
    throw redirect({ to, from: "/" });
  },
  component: () => (
    <>
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools initialIsOpen={false} />
      </Suspense>
    </>
  ),
});
