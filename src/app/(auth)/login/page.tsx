import { Metadata } from "next";
import Link from "next/link";
import { UserAuthForm } from "../../../components/admin-panel/user-auth-form";
import { Card } from "../../../components/ui/card";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default function AuthenticationPage() {
  return (
    <Card>
      <div className="flex flex-col p-4 lg:w-1/3">
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
              <Link href="/dashboard">
                Login
              </Link>
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to login your account
              </p>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </Card>
  )
}