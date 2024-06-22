import { Prisma, PrismaClient, Session } from "@prisma/client";

export interface SessionRepository {
  create(data: Prisma.SessionCreateArgs["data"]): Promise<Session>;
  delete(sessionId: string): Promise<void>;
}

export const makeSessionRepository = (
  prisma: PrismaClient,
): SessionRepository => {
  return {
    async create(data) {
      return prisma.session.create({ data });
    },
    async delete(sessionId) {
      await prisma.session.delete({ where: { sessionId } });
    },
  };
};
