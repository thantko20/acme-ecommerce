import {
  Outlet,
  createRootRouteWithContext,
  redirect,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

import { useAuthStore } from "@/components/auth-provider";
import { trpc } from "@/lib/trpc";

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

    try {
      const { hasAdmin } = await context.client.auth.checkForFirstAdmin.query();
      const to = hasAdmin ? LoginRoute.fullPath : RegisterRoute.fullPath;
      throw redirect({ to, from: "/" });
    } catch (error) {
      throw redirect({ to: '/auth/register' });
    }
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
