import { Prisma, PrismaClient, User } from "@prisma/client";

import { roles } from "@thantko/common/types";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(
    data: Prisma.UserCreateInput,
  ): Promise<Omit<User, "password" | "salt">>;
  findAdminByEmail(email: string): Promise<User | null>;
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
