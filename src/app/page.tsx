"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { APIError } from "better-auth";
import { Loader2, LogOut, User, UserStar } from "lucide-react";
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
      <div className="h-dvh w-dvw grid place-content-center">
        <div className="flex space-x-3 items-center justify-center text-gray-400">
          <Loader2 className="animate-spin size-8" />
          <h1 className="text-4xl font-semibold">Loading...</h1>
        </div>
      </div>
    );
  }
  if (!session) {
    return (
      <div className="h-dvh w-dvw grid place-content-center">
        <h1 className="text-4xl font-semibold">
          <Link href={"/auth/login"}>Login</Link>
        </h1>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="h-dvh w-dvw grid place-content-center">
      <div className=" text-center space-y-5">
        <div className=" flex justify-center items-center">
          {session?.user.image && (
            <Image
              className=" rounded-full"
              src={session?.user.image || ""}
              alt=""
              width={150}
              height={150}
            />
          )}
        </div>
        <h1 className=" text-2xl font-semibold">
          Welcome back,{" "}
          <span className=" text-3xl font-bold">{session?.user?.name}</span>!
        </h1>
        <div>
          <Link className=" my-4" href={"/dashboard"}>
            Go to dashboard
          </Link>
        </div>

        <div className=" flex gap-4 justify-center">
          <Link href={"/profile"}>
            <Button className=" cursor-pointer" variant={"outline"}>
              <User />
              Profile
            </Button>
          </Link>

          {hasPermission && (
            <Link href={"/admin"}>
              <Button className=" cursor-pointer">
                <UserStar />
                Admin
              </Button>
            </Link>
          )}

          <Button
            disabled={isLoading}
            onClick={handleSignOut}
            className=" cursor-pointer"
            variant={"destructive"}
          >
            {isLoading ? <Loader2 className=" animate-spin" /> : <LogOut />}
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
