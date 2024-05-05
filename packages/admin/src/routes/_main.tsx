import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main")({
  component: () => (
    <div>
      Hello /_main-layout!
      <Outlet />
    </div>
  ),
});
