import React from "react";

import { cn } from "@/lib/utils";

export const FieldMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>((props, ref) => {
  const { className, children, ...rest } = props;
  return children ?
      <p
        ref={ref}
        className={cn("text-destructive text-sm", className)}
        {...rest}
      >
        {children}
      </p>
    : null;
});
