import { trpc } from "@/lib/trpc";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { AuthStore } from "@/components/auth-provider";
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
  authStore: AuthStore;
  user: User;
}>()({
  beforeLoad: async ({ context }) => {
    let user: User | undefined = undefined;
    try {
      const data = await context.client.auth.me.query();
      user = data.user;
      context.authStore.actions.onLoggedIn(data.user);
    } catch {
      context.authStore.actions.onLoggedOut();
    }
    return {
      ...context,
      user,
    };
  },
  component: () => (
    <>
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools initialIsOpen={false} />
      </Suspense>
    </>
  ),
  pendingComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p>Checking if you're legitimate or not fr on god</p>
    </div>
  ),
});
