import {
  createRootRoute,
  Link as RouterLink,
  Outlet,
} from "@tanstack/react-router";
import { Link } from "@radix-ui/themes";
import { lazy, Suspense } from "react";

const TanStackRouterDevtools =
  import.meta.env.PROD ?
    () => null
  : lazy(() =>
      import("@tanstack/router-devtools").then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    );

export const Route = createRootRoute({
  component: () => (
    <>
      <div>
        <Link asChild>
          <RouterLink to="/">Home</RouterLink>
        </Link>
        <Link asChild>
          <RouterLink to="/about">About</RouterLink>
        </Link>
        <Link asChild>
          <RouterLink to="/test">Test</RouterLink>
        </Link>
      </div>
      <hr />
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools initialIsOpen={false} />
      </Suspense>
    </>
  ),
});
