import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_main/")({
  component: Index,
});

function Index() {
  return <div>Hello /!</div>;
}
