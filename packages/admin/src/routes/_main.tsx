import {
  Outlet,
  createFileRoute,
  Link,
  redirect,
} from "@tanstack/react-router";
import { Package2 } from "lucide-react";

import { NavLink } from "@/components/nav-link";
import { Header } from "@/components/header";
import { routeLinks } from "@/lib/route-links-constants";
import { trpc } from "@/lib/trpc";

export const Route = createFileRoute("/_main")({
  beforeLoad: async () => {
    let hasFirstAdmin = true;
    const hasFirstAdminLS = localStorage.getItem("has-first-admin");

    if (hasFirstAdminLS !== "true") {
      const { hasAdmin } = await trpc.auth.checkForFirstAdmin.query();
      hasFirstAdmin = hasAdmin;
    }

    if (!hasFirstAdmin) {
      throw redirect({
        to: "/auth/register",
      });
    }
    localStorage.setItem("has-first-admin", "true");
  },
  component: Layout,
});

function Layout() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Acme Inc</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {routeLinks.map((link) => (
                <NavLink key={link.label} {...link} />
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
