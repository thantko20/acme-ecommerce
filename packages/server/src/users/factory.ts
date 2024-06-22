import { faker } from "@faker-js/faker";
import { randomUUID } from "crypto";

import { User, roles } from "@thantko/common/types";
import { UserWithCredentials } from "@thantko/common/validations";

export const makeFakeUser = (): UserWithCredentials => {
  return {
    id: randomUUID(),
    name: faker.person.fullName(),
    email: faker.internet.exampleEmail(),
    createdAt: new Date(),
    updatedAt: new Date(),
    role: Math.random() > 0.5 ? roles.ADMIN : roles.USER,
    password: faker.internet.password(),
    salt: "",
  };
};
