import { createLazyFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createLazyFileRoute("/_main/")({
  component: Index,
});

function Index() {
  return <Button>Click!</Button>;
}
