import { Home, ShoppingCart, Package, Users, LineChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NavLinkProps } from "@/components/nav-link";

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
    to: "/",
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
    to: "/",
    label: "Customers",
    icon: Users,
  },
  {
    to: "/test",
    label: "Analytics",
    icon: LineChart,
  },
];
