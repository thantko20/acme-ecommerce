import React from "react";

import { cn } from "@/lib/utils";

export const FieldWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <div ref={ref} className={cn("grid gap-2", className)} {...rest}>
      {children}
    </div>
  );
});
