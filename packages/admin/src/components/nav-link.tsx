import { Link } from "@tanstack/react-router";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";

import { RoutePath } from "@/lib/types";
import { cn } from "@/lib/utils";

export type NavLinkProps = {
  to: RoutePath;
  label: ReactNode;
  className?: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  rightSection?: ReactNode;
};

export const NavLink = (props: NavLinkProps) => {
  const { to, label, className, icon: Icon, rightSection } = props;
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-4 rounded-xl hover:text-foreground md:gap-3 md:rounded-lg px-3 py-2 text-muted-foreground transition-all md:hover:text-primary",
        className,
      )}
      activeProps={{
        className: "bg-muted text-primary",
      }}
    >
      <Icon className="size-5 md:size-4" />
      {label}
      {rightSection ?
        <div className="ml-auto">{rightSection}</div>
      : null}
    </Link>
  );
};
