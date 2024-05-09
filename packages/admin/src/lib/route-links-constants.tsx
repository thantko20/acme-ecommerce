import { Home, LineChart, Package, ShoppingCart, Users } from "lucide-react";

import { NavLinkProps } from "@/components/nav-link";
import { Badge } from "@/components/ui/badge";

type RouteLink = Omit<NavLinkProps, "className" | "children"> & {
  label: string;
};

export const routeLinks: Array<RouteLink> = [
  {
    to: "/",
    label: "Dashboard",
    icon: Home,
  },
  {
    to: "/orders",
    label: "Orders",
    icon: ShoppingCart,
    rightSection: (
      <Badge className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
        6
      </Badge>
    ),
  },
  {
    to: "/products",
    label: "Products",
    icon: Package,
  },
  {
    to: "/customers",
    label: "Customers",
    icon: Users,
  },
  {
    to: "/analytics",
    label: "Analytics",
    icon: LineChart,
  },
];
