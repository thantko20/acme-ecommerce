import { createFileRoute } from "@tanstack/react-router";

import { AttributeForm } from "@/components/attributes";

export const Route = createFileRoute("/_main/attributes/add")({
  component: AddAttribute,
});

function AddAttribute() {
  return (
    <AttributeForm
      mode="create"
      defaultValues={{
        name: "",
        values: [{ name: "" }],
      }}
    />
  );
}
