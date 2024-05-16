import { createFileRoute } from "@tanstack/react-router";

import { AttributeForm } from "@/components/attributes";

export const Route = createFileRoute("/_main/attributes/$attributeId/edit")({
  component: EditAttribute,
  loader: async ({ params, context }) => {
    return context.client.attribute.byIdOrSlug.query({
      id: params.attributeId,
    });
  },
  gcTime: 2000,
});

function EditAttribute() {
  const attribute = Route.useLoaderData({
    select(search) {
      return search.data;
    },
  });

  if (!attribute) {
    throw new Error("Attribute not found");
  }

  return (
    <AttributeForm
      mode="edit"
      defaultValues={{
        ...attribute,
      }}
    />
  );
}
