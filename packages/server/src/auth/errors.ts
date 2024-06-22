import { TRPCError } from "@trpc/server";

export const ERR_INVALID_CREDENTIALS = new TRPCError({
  message: "Invalid email or password.",
  code: "BAD_REQUEST",
});
