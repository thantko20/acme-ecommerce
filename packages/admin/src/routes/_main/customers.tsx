import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "../../lib/trpc";

export const Route = createFileRoute("/_main/customers")({
  component: () => (
    <>
      <DisplayData />
    </>
  ),
  loader: async () => {
    return trpc.user.list.query();
  },
  gcTime: 10000,
  staleTime: 5000,
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
