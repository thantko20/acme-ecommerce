import { createFileRoute, notFound } from "@tanstack/react-router";

import { ProductForm } from "@/components/products";

export const Route = createFileRoute("/_main/products/$productId/edit")({
  component: ProductEdit,
  loader: async ({ context, params }) => {
    const result = await context.client.product.byIdOrSlug.query({
      id: params.productId,
    });
    if (!result.data) {
      throw notFound();
    }
    return result.data;
  },
  notFoundComponent: () => {
    return <div>Product Not Found</div>;
  },
});

function ProductEdit() {
  const product = Route.useLoaderData();
  return (
    <ProductForm
      mode="edit"
      defaultValues={{
        id: product.id,
        name: product.name,
        description: product.description,
      }}
    />
  );
}
