import { describe, expect, it } from "vitest";

import { roles } from "@thantko/common/types";

import { ERR_EMAIL_ALREADY_EXISTS } from "./errors";
import { UserRepository } from "./repository";
import { makeCreateAdmin } from "./service";

const fakeUserRepo: UserRepository = {
  async create(data) {
    return {
      name: data.name,
      email: data.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: "1",
      role: roles[data.role!],
    };
  },
  async findAdminByEmail() {
    return null;
  },
  async findByEmail(email) {
    return null;
  },
};

describe("users service", function () {
  describe("create admin", function () {
    it("creates an admin", async function () {
      const createAdmin = makeCreateAdmin({
        userRepository: {
          ...fakeUserRepo,
        },
      });

      const admin = await createAdmin({
        name: "John Doe",
        password: "123456",
        email: "johndoe@example.com",
      });

      expect(admin.email).toBe("johndoe@example.com");
    });

    it("throws error if email already exists", function () {
      const createAdmin = makeCreateAdmin({
        userRepository: {
          ...fakeUserRepo,
          async findByEmail() {
            return {
              id: "1",
              name: "John Doe",
              email: "johndoe@example.com",
              password: "",
              salt: "",
              createdAt: new Date(),
              updatedAt: new Date(),
              role: roles.ADMIN,
            };
          },
        },
      });

      expect(() =>
        createAdmin({
          name: "John Doe",
          email: "johndoe@example.com",
          password: "",
        }),
      ).rejects.toThrowError(ERR_EMAIL_ALREADY_EXISTS);
    });
  });
});
