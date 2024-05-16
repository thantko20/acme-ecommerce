import { PartialDeep } from "type-fest";

export type BaseModel = {
  id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export type DeepPartial<T> = PartialDeep<T>;
