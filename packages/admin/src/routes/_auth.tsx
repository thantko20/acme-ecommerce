import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Package2 } from "lucide-react";

export const Route = createFileRoute("/_auth")({
  component: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-4">
          <Package2 className="size-10" />
          <h3 className="text-2xl font-bold">Acme Inc</h3>
        </div>
        <Outlet />
      </div>
    </div>
  ),
});
