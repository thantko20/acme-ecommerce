import { PrismaClient } from "@prisma/client";

const prisma =
  (globalThis as unknown as { prisma?: PrismaClient }).prisma ||
  new PrismaClient();

(globalThis as unknown as { prisma: PrismaClient }).prisma = prisma;

export { prisma };
