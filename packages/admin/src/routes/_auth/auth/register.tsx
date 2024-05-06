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
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { trpc } from "@/lib/trpc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@thantko/common/validations";

export const Route = createFileRoute("/_auth/auth/register")({
  component: () => <Register />,
});

function Register() {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = trpc.auth.registerAdmin.useMutation();

  const navigate = useNavigate();
  return (
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
          <Input
            type="text"
            placeholder="John Doe"
            {...form.register("name")}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <p className="text-muted-foreground text-xs">
            Email will be used to login to your account.
          </p>
          <Input
            type="email"
            placeholder="m@example.com"
            {...form.register("email")}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input type="password" {...form.register("password")} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input type="password" {...form.register("confirmPassword")} />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={async () => {
            if (await form.trigger()) {
              registerMutation.mutate(form.getValues(), {
                onSuccess: () => {
                  navigate({ to: "/auth/login" });
                },
                onError: console.log,
              });
            }
          }}
        >
          {registerMutation.isPending ? "Loading" : "Register"}
        </Button>
      </CardFooter>
    </Card>
  );
}
