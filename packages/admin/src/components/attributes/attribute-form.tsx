import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import { DeepPartial } from "@thantko/common/types";
import {
  CreateAttributeSchema,
  EditAttributeSchema,
  createAttributeSchema,
  editAttributeSchema,
} from "@thantko/common/validations";

import { trpc } from "@/lib/trpc";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
  mode: "create" | "edit";
  defaultValues: DeepPartial<CreateAttributeSchema | EditAttributeSchema>;
};

export const AttributeForm = (props: Props) => {
  const { mode, defaultValues } = props;
  const navigate = useNavigate();
  const form = useForm<CreateAttributeSchema | EditAttributeSchema>({
    resolver: zodResolver(
      mode === "create" ? createAttributeSchema : editAttributeSchema,
    ),
    defaultValues,
  });
  const valuesFieldArray = useFieldArray({
    control: form.control,
    name: "values",
  });

  const createMutation = trpc.attribute.create.useMutation();
  const editMutation = trpc.attribute.edit.useMutation();

  const onSubmit = form.handleSubmit((data) => {
    if (mode === "create") {
      createMutation.mutate(data, {
        onSuccess: () => {
          navigate({ to: "/attributes" });
        },
      });
    } else if (mode === "edit") {
      editMutation.mutate(data as EditAttributeSchema, {
        onSuccess: () => {
          navigate({ to: "/attributes" });
        },
      });
    }
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold">
        {mode === "create" ? "Create" : "Edit"} Attribute
      </h2>
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
              {mode === "create" ? "Create" : "Edit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
