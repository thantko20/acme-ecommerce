import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/products")({
  component: () => <div>Hello /_main/products!</div>,
});
