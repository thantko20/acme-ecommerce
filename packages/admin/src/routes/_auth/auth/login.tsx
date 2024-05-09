import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { sleep } from "@thantko/common/utils";
import { LoginSchema, loginSchema } from "@thantko/common/validations";

import { useAuthStore } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";

export const Route = createFileRoute("/_auth/auth/login")({
  component: () => <LoginForm />,
});

function LoginForm() {
  const authStore = useAuthStore();
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const loginMutation = trpc.auth.loginAdmin.useMutation();
  const onSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: async (result) => {
        authStore.actions.onLoggedIn(result.user);

        // because state was updated after navigation
        await sleep(0);
        navigate({ to: "/" });
      },
      onError: console.log,
    });
  });

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your <strong>admin</strong>{" "}
          account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" className="grid gap-4" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              {...form.register("email")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              {...form.register("password")}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          form="login-form"
          className="w-full"
          type="submit"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Loading" : "Sign In"}
        </Button>
      </CardFooter>
    </Card>
  );
}
