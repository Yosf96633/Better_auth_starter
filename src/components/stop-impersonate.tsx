"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { UserX } from "lucide-react";
import { useRouter } from "next/navigation";
export function ImpersonationIndicator() {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();

  if (session?.session.impersonatedBy == null) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
       className=" cursor-pointer"
        variant={"destructive"}
        onClick={() =>
          authClient.admin.stopImpersonating(undefined, {
            onSuccess: () => {
              router.push("/admin");
              refetch();
            },
          })
        }
        size='icon-lg'
      >
        <UserX className="size-4" />
      </Button>
    </div>
  );
}
