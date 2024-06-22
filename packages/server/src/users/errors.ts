import { TRPCError } from "@trpc/server";

export const ERR_EMAIL_ALREADY_EXISTS = new TRPCError({
  message: "Email already exists",
  code: "CONFLICT",
});
