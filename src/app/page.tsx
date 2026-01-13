"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { APIError } from "better-auth";
import { Loader2, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { data: session, isPending, error } = authClient.useSession();
  useEffect(() => {
    console.log("User sessions: ", session);
  }, [session]);
  if (isPending || !session) {
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
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await authClient.signOut({
        fetchOptions: {
          onSuccess() {
            router.push("/signup");
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
  return (
    <div className="h-dvh w-dvw grid place-content-center">
      <div className=" text-center space-y-5">
        <div className=" flex justify-center items-center">
          {session?.user.image && (
            <Image
              className=" rounded-full"
              src={session?.user.image || ""}
              alt=""
              width={100}
              height={100}
            />
          )}
        </div>
        <h1 className=" text-2xl font-semibold">
          Welcome back,{" "}
          <span className=" text-3xl font-bold">{session?.user?.name}</span>!
        </h1>
        <Link className=" my-4" href={"/dashboard"}>Go to dashboard</Link> <br />
        <Button
          disabled={isLoading}
          onClick={handleSignOut}
          className=" cursor-pointer"
        >
          {isLoading ? <Loader2 className=" animate-spin" /> : <LogOut />}
          Sign out
        </Button>
      </div>
    </div>
  );
}
