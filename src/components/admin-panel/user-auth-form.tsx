"use client";

import * as React from "react";
import { loginUser } from "@/services/auth";
import { setAuthDetails } from "../../lib/cookies";
import { validateEmail } from "../../lib/validation";
import { cn } from "@/lib/utils";
import { Icons } from "../ui/icon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate email format
    if (!validateEmail(email)) {
      setError("Invalid email format");
      setIsLoading(false);
      return;
    }

    try {
      // Call the loginUser function to hit your backend API
      const { token, user } = await loginUser(email, password);

      // Check if token and user are properly returned
      if (token && user) {
        // Store JWT token and user details in cookies
        setAuthDetails(token, user);

        // Ensure cookies are set before redirecting
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100);
      } else {
        throw new Error("Login failed");
      }
    } catch (error: any) {
      // Handle login failure and set error message
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Enter password"
              type="password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.microsoftSSO className="mr-2 h-4 w-4" />
        )}{" "}
        Microsoft
      </Button>
    </div>
  );
}