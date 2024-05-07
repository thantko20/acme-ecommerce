import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/customers")({
  component: () => (
    <>
      <DisplayData />
    </>
  ),
  loader: async ({ context }) => {
    return context.client.user.listCustomers.query({ limit: 10, page: 1 });
  },
});

function DisplayData() {
  const customers = Route.useLoaderData();
  return (
    <>
      {customers.map((customer) => (
        <p key={customer.id}>{customer.name}</p>
      ))}
    </>
  );
}
