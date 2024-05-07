import { Role, User } from "./users";

export type JwtPayload = {
  user: User;
  type: Role;
};
