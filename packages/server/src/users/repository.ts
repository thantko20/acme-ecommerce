import { Prisma, PrismaClient } from "@prisma/client";

import { User, roles } from "@thantko/common/types";
import { UserWithCredentials } from "@thantko/common/validations";

export interface UserRepository {
  findByEmail(email: string): Promise<UserWithCredentials | null>;
  create(data: Prisma.UserCreateArgs["data"]): Promise<User>;
  findAdminByEmail(email: string): Promise<UserWithCredentials | null>;
}

export const makeUsersRepository = (prisma: PrismaClient): UserRepository => {
  return {
    async findByEmail(email: string) {
      return prisma.user.findUnique({
        where: { email },
      });
    },
    async create(data: Prisma.UserCreateInput) {
      return prisma.user.create({
        data,
        omit: {
          password: true,
          salt: true,
        },
      });
    },
    async findAdminByEmail(email: string) {
      return prisma.user.findUnique({
        where: { email, role: roles.ADMIN },
      });
    },
  } as const;
};
