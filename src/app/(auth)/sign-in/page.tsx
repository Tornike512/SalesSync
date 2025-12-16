import { Suspense } from "react";
import { SignIn } from "@/components/sign-in/sign-in";
export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <SignIn />
    </Suspense>
  );
}
