"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { APIError } from "better-auth";
import { Loader2, LogOut, User, UserStar, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess() {
            router.push("/auth/login");
          },
          onError(context) {
            toast.error(context.error.message);
          },
        },
      });
    } catch (error) {
      console.log("Error during signout in homePage : ", error);
      if (error instanceof APIError) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    authClient.admin
      .hasPermission({
        permission: {
          user: ["list"],
        },
      })
      .then(({ data }) => {
        setHasPermission(data?.success ?? false);
      })
      .catch((error) => {
        console.error("Permission check failed:", error);
        setHasPermission(false);
      });
  }, []);

  if (isPending) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-slate-600 dark:text-slate-400" />
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              You need to be logged in to access this page
            </p>
            <Link href="/auth/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Card className="w-full max-w-md mx-4 border-red-200 dark:border-red-900">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 dark:text-red-400">
              Error: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {session?.user.image ? (
              <div className="relative">
                <Image
                  className="rounded-full ring-4 ring-slate-200 dark:ring-slate-800"
                  src={session.user.image}
                  alt={session.user.name || "User avatar"}
                  width={120}
                  height={120}
                />
              </div>
            ) : (
              <div className="h-[120px] w-[120px] rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center ring-4 ring-slate-200 dark:ring-slate-800">
                <User className="h-16 w-16 text-slate-500 dark:text-slate-400" />
              </div>
            )}
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Welcome back,
          </h1>
          <p className="text-3xl font-bold">
            {session.user.name || "User"}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Link href="/profile" className="block">
              <Button className="w-full" variant="outline" size="lg">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>

            {hasPermission && (
              <Link href="/admin" className="block">
                <Button className="w-full" variant="secondary" size="lg">
                  <UserStar className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}

            {!hasPermission && <div />}
          </div>

          <Button
            onClick={handleSignOut}
            disabled={isLoading}
            className="w-full"
            variant="destructive"
            size="lg"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
