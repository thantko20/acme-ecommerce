import { Button } from "@/components/ui/button";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_main/")({
  component: Index,
});

function Index() {
  return <Button>Click!</Button>;
}
