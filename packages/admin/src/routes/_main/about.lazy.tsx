import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_main/about")({
  component: About,
});

function About() {
  return <div>Hello /about!</div>;
}
