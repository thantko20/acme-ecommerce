import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
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
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/test">Test</Link>
      </div>
      <hr />
      <Outlet />
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  ),
});
