import { Link, createFileRoute } from "@tanstack/react-router";
import { MoreHorizontal } from "lucide-react";

import { AttributeItem } from "@thantko/common/validations";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_main/attributes")({
  component: () => <Attributes />,
  loader: async ({ context }) => {
    return context.client.attribute.list.query();
  },
});

function Attributes() {
  const { data: attributes } = Route.useLoaderData();
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button asChild size="sm">
          <Link to="/attributes/add">Add Attribute</Link>
        </Button>
      </div>
      <AttributesTable attributes={attributes} />
    </div>
  );
}

function AttributesTable({ attributes }: { attributes: AttributeItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attributes</CardTitle>
        <CardDescription>Manage Your Attributes</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Values</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attributes.map((attribute) => (
              <TableRow key={attribute.id}>
                <TableCell className="font-medium">{attribute.name}</TableCell>
                <TableCell>
                  {attribute.values.map((value) => value.name).join(", ")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link
                          to={`/attributes/${attribute.slug || attribute.id}/edit`}
                        >
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> products
        </div>
      </CardFooter>
    </Card>
  );
}
