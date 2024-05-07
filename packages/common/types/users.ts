import { BaseModel } from "./common";

export const roles = { ADMIN: "ADMIN", USER: "USER" } as const;

export type Role = keyof typeof roles;

export type UserSensitive = BaseModel & {
  name: string;
  email: string;
  password: string;
  salt: string;
};

export type User = Omit<UserSensitive, "password" | "salt">;
