import { Session } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import crypto from "node:crypto";

import { LoginSchema } from "@thantko/common/validations";

import { UserRepository } from "../users/repository";
import { ERR_INVALID_CREDENTIALS } from "./errors";
import { SessionRepository } from "./session-repository";

const generateToken = (byteSize: number = 15) => {
  const bytes = crypto.randomBytes(byteSize);
  return Buffer.from(bytes).toString("base64");
};

export const makeLoginAdmin = (deps: { userRepo: UserRepository }) => {
  const { userRepo } = deps;

  return async function (data: LoginSchema) {
    const { email, password } = data;

    const admin = await userRepo.findAdminByEmail(email);
    if (!admin) {
      throw ERR_INVALID_CREDENTIALS;
    }

    const isValidPw = await bcrypt.compare(password, admin.password);
    if (!isValidPw) {
      throw ERR_INVALID_CREDENTIALS;
    }

    return admin;
  };
};

const ADMIN_SESSION_EXPIRES_AT = dayjs().add(30, "days").toDate();
const SESSION_TOKEN_BYTE_SIZE = 15;

export const makeCreateAdminSession = (deps: {
  sessionRepo: SessionRepository;
}) => {
  const { sessionRepo } = deps;
  return async function (adminId: string) {
    const sessionId = generateToken(SESSION_TOKEN_BYTE_SIZE);
    return sessionRepo.create({
      expiresAt: ADMIN_SESSION_EXPIRES_AT,
      sessionId,
      userId: adminId,
    });
  };
};

export const makeLogoutAdmin = (deps: { sessionRepo: SessionRepository }) => {
  const { sessionRepo } = deps;
  return async function (session: Session | null) {
    if (session?.sessionId) {
      await sessionRepo.delete(session.sessionId);
    }
  };
};
