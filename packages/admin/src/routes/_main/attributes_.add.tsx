import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import {
  type CreateAttributeSchema,
  createAttributeSchema,
} from "@thantko/common/validations";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";

export const Route = createFileRoute("/_main/attributes/add")({
  component: AddAttribute,
});

function AddAttribute() {
  const navigate = useNavigate();
  const form = useForm<CreateAttributeSchema>({
    resolver: zodResolver(createAttributeSchema),
    defaultValues: {
      name: "",
      values: [{ name: "" }],
    },
  });
  const valuesFieldArray = useFieldArray({
    control: form.control,
    name: "values",
  });

  const mutation = trpc.attribute.create.useMutation();

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        navigate({ to: "/attributes" });
      },
    });
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Create Attribute</h2>
      <Card className="mt-4">
        <CardContent className="pt-4">
          <form className="w-full space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="name"
                placeholder="Color"
                required
                {...form.register("name")}
              />
            </div>
            <div className="grid gap-2">
              <Label>Values</Label>
              {valuesFieldArray.fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    className="flex-1"
                    required
                    {...form.register(`values.${index}.name`)}
                  />
                  <div className="shrink-0 flex gap-2">
                    {valuesFieldArray.fields.length - 1 === index ?
                      <Button
                        onClick={() => valuesFieldArray.append({ name: "" })}
                        size="icon"
                      >
                        <Plus />
                      </Button>
                    : null}
                    {valuesFieldArray.fields.length > 1 ?
                      <Button
                        onClick={() => valuesFieldArray.remove(index)}
                        size="icon"
                        variant={"destructive"}
                      >
                        <Minus />
                      </Button>
                    : null}
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full" type="submit">
              Create
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
