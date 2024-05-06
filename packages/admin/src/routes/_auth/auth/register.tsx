import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createFileRoute } from "@tanstack/react-router";
import { Package2 } from "lucide-react";

export const Route = createFileRoute("/_auth/auth/register")({
  component: () => <Register />,
});

function Register() {
  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col items-center gap-4">
        <Package2 className="size-10" />
        <h3 className="text-2xl font-bold">Acme Inc</h3>
      </div>
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Welcome! You have to register to use this panel.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="John Doe" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <p className="text-muted-foreground text-xs">
              Email will be used to login to your account.
            </p>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Register</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
