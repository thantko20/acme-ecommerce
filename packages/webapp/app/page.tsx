import { Button, Flex, Text } from "@radix-ui/themes";
import { revalidatePath } from "next/cache";

import { trpc } from "./trpc";

export default async function Home() {
  const users = await trpc.user.list.query();
  console.log({ users });
  async function action() {
    "use server";
    await trpc.user.create.mutate();
    revalidatePath("/");
  }
  return (
    <Flex width="100%" height="100%" justify={"center"} align={"center"}>
      <Text>Hello from radix themes :)</Text>
      <Button>Let's go!</Button>
    </Flex>
  );
}
