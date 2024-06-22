import bcrypt from "bcrypt";
import { describe, expect, it } from "vitest";

import { makeFakeUser } from "../users/factory";
import { UserRepository } from "../users/repository";
import { makeFakeUserRepository } from "../users/utils";
import { ERR_INVALID_CREDENTIALS } from "./errors";
import { makeLoginAdmin } from "./service";
import { SessionRepository } from "./session-repository";

const fakeSessionRepo: SessionRepository = {
  async create(data) {
    return {
      createdAt: new Date(),
      expiresAt: new Date(),
      sessionId: "",
      updatedAt: new Date(),
      userId: "",
    };
  },
  async delete(sessionId) {},
};

describe("auth service", function () {
  it("logs in admin with correct credentials and returns admin with email", async function () {
    const email = "testinguser@example.com";
    const password = "testinguser123";
    const fakeUserRepo: UserRepository = {
      ...makeFakeUserRepository(),
      async findAdminByEmail() {
        return {
          ...makeFakeUser(),
          email,
          password: await bcrypt.hash(password, 10),
          salt: "12345",
        };
      },
    };

    const loginAdmin = makeLoginAdmin({
      userRepo: fakeUserRepo,
    });

    const result = await loginAdmin({
      email,
      password,
    });

    expect(result.email).toBe(email);
  });

  it("throws error if the admin is not found", async function () {
    const fakeUserRepo: UserRepository = {
      ...makeFakeUserRepository(),
      async findAdminByEmail() {
        return null;
      },
    };

    const loginAdmin = makeLoginAdmin({
      userRepo: fakeUserRepo,
    });

    expect(() =>
      loginAdmin({ email: "johndoe@example.com", password: "123456" }),
    ).rejects.toThrowError(ERR_INVALID_CREDENTIALS);
  });

  it("throws error if the password is incorrect", async function () {
    const correctPassword = await bcrypt.hash("testing123", 10);
    const fakerUserRepo: UserRepository = {
      ...makeFakeUserRepository(),
      async findAdminByEmail(email) {
        return {
          ...makeFakeUser(),
          email: "johndoe@example.com",
          password: correctPassword,
        };
      },
    };

    const loginAdmin = makeLoginAdmin({
      userRepo: fakerUserRepo,
    });

    expect(() =>
      loginAdmin({
        email: "johndoe@example.com",
        password: "incorrect_password",
      }),
    ).rejects.toThrowError(ERR_INVALID_CREDENTIALS);
  });
});
