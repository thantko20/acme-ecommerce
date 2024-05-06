import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/auth/register")({
  component: () => <div>Hello /auth/register!</div>,
});
