"use client";

import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function Home() {
  // useSession() is a hook. It automatically fetches the session
  // and updates the UI when the status changes.
  const { data: session, isPending, error } = authClient.useSession();

  if (isPending) {
    return (
      <div className="h-dvh w-dvw grid place-content-center">
        <div className="flex space-x-3 items-center justify-center text-gray-400">
          <Loader2 className="animate-spin size-8" />
          <h1 className="text-4xl font-semibold">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-8">
      {session ? (
        <h1>Welcome back, {session.user.name}!</h1>
      ) : (
        <h1>Please sign in.</h1>
      )}
    </div>
  );
}