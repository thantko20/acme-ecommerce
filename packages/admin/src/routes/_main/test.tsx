import { createFileRoute } from "@tanstack/react-router";

import { trpc } from "../../lib/trpc";

export const Route = createFileRoute("/_main/test")({
  component: () => (
    <>
      <DisplayData />
    </>
  ),
  loader: async () => {
    return trpc.user.list.query();
  },
  gcTime: 0,
  staleTime: 0,
});

function DisplayData() {
  const users = Route.useLoaderData();
  return (
    <>
      {users.map((user) => (
        <p key={user.email}>{user.name}</p>
      ))}
    </>
  );
}
