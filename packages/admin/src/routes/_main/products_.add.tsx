import { createFileRoute } from "@tanstack/react-router";

import { ProductForm } from "@/components/products";

export const Route = createFileRoute("/_main/products/add")({
  component: AddProduct,
  loader: async ({ context }) => {
    const attributesResult = await context.client.attribute.list.query({
      limit: 0,
    });
    return { attributes: attributesResult.data };
  },
});

function AddProduct() {
  const { attributes } = Route.useLoaderData();
  return (
    <div>
      <ProductForm
        attributes={attributes}
        mode="create"
        defaultValues={{
          name: "",
          description: "",
          attributes: [{ attributeId: "" }],
        }}
      />
    </div>
  );
}
