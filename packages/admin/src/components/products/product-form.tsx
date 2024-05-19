import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, Minus } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";

import {
  AttributeItem,
  CreateProductSchema,
  EditProductSchema,
  createProductSchema,
  editProductSchema,
} from "@thantko/common/validations";

import { trpc } from "@/lib/trpc";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { FieldMessage } from "../ui/field-message";
import { FieldWrapper } from "../ui/field-wrapper";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

type Props = {
  mode: "create" | "edit";
  defaultValues: CreateProductSchema | EditProductSchema;
  attributes: AttributeItem[];
};

export const ProductForm = (props: Props) => {
  const { mode, defaultValues, attributes } = props;
  const schema = mode === "create" ? createProductSchema : editProductSchema;
  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const attributesField = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const createMutation = trpc.product.create.useMutation();
  const editMutation = trpc.product.edit.useMutation();
  const isPending = createMutation.isPending || editMutation.isPending;
  const navigate = useNavigate();

  const onSubmit = (data: CreateProductSchema | EditProductSchema) => {
    if (mode === "create") {
      createMutation.mutate(data, {
        onSuccess: () => {
          navigate({ to: "/products" });
        },
      });
      return;
    }
    editMutation.mutate(data as EditProductSchema, {
      onSuccess: () => {
        navigate({ to: "/products" });
      },
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? "Add" : "Edit"} Product</CardTitle>
          <CardDescription>Just add a damn product!</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldWrapper>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                className="w-full"
                {...form.register("name")}
              />
              <FieldMessage>{form.formState.errors.name?.message}</FieldMessage>
            </FieldWrapper>
            <FieldWrapper>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                className="min-h-32"
                {...form.register("description")}
              />
              <FieldMessage>
                {form.formState.errors.description?.message}
              </FieldMessage>
            </FieldWrapper>
            <Button type="submit" className="w-full" loading={isPending}>
              {mode === "create" ? "Add" : "Edit"} Product
            </Button>
          </form>
        </CardContent>
      </Card>

      <Collapsible>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center gap-4">
              <CardTitle>Attributes</CardTitle>
              <CollapsibleTrigger asChild>
                <Button size="icon" variant="ghost">
                  <ChevronDown />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CardDescription>
              Select different attributes your product will have.
            </CardDescription>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <div className="grid gap-4">
                {attributesField.fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Select
                      value={field.attributeId}
                      defaultValue={field.attributeId}
                      onValueChange={(value) =>
                        attributesField.prepend({
                          attributeId: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose the attribute" />
                      </SelectTrigger>
                      <SelectContent>
                        {attributes
                          .filter(
                            (attribute) =>
                              !attributesField.fields
                                .map(({ attributeId }) => attributeId)
                                .includes(attribute.id),
                          )
                          .map((attribute) => (
                            <SelectItem key={attribute.id} value={attribute.id}>
                              {attribute.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {index !== 0 ?
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => attributesField.remove(index)}
                      >
                        <Minus />
                      </Button>
                    : null}
                  </div>
                ))}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};
