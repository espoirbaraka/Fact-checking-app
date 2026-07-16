import { Suspense } from "react";
import { GuestGuard } from "@/components/auth/GuestGuard";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <GuestGuard>
      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </GuestGuard>
  );
}
