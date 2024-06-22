import * as bcrypt from "bcrypt";

import { roles } from "@thantko/common/types";
import { RegisterSchema } from "@thantko/common/validations";

import { ERR_EMAIL_ALREADY_EXISTS } from "./errors";
import { UserRepository } from "./repository";

const SALT_ROUNDS = 10;

export const makeCreateAdmin = (deps: { userRepository: UserRepository }) => {
  const { userRepository } = deps;

  return async function (data: Omit<RegisterSchema, "confirmPassword">) {
    const { email, name, password } = data;
    const emailExists = await userRepository.findByEmail(email);
    if (emailExists) {
      throw ERR_EMAIL_ALREADY_EXISTS;
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPw = await bcrypt.hash(password, salt);

    return userRepository.create({
      name,
      email,
      password: hashedPw,
      salt,
      role: roles.ADMIN,
    });
  };
};
