import { ComponentProps } from "react";

export type ButtonProps = ComponentProps<"button">;

export const Button = (props: ButtonProps) => {
  const { children } = props;
  return <button {...props}>{children}</button>;
};
