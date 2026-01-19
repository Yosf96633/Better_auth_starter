import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import {
  ArrowLeft,
  Key,
  LinkIcon,
  Loader2,
  Shield,
  Trash,
  User,
} from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateProfileForm } from "./_components/profile-update-form";
import { ReactNode, Suspense } from "react";
import Account_deletion from "./_components/account_deletion";
import ChangePassword from "./_components/changePassword";
import SetPassword from "./_components/set-password";
import Set_session_Tab from "./_components/setSession";
import { AccountLinking } from "./_components/account-linking";
import TwoAuthFactor from "./_components/twoAuthFactor";
import { PasskeyManagement } from "./_components/passkeys-managment";
export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session === null) {
    redirect("/auth/login");
  }
  return (
    <div className=" px-6 py-10">
      <div className=" mb-8 max-sm:mb-4">
        <Link href={"/"}>
          <Button variant={"ghost"}>
            <ArrowLeft />
            Go to Home
          </Button>
        </Link>
        <div className=" flex  space-x-3 mt-4">
          <Image
            className=" rounded-full border-2 border-black"
            src={session.user.image || "/placeholder.jpg"}
            alt={session.user.name}
            width={60}
            height={60}
          />
          <div className="">
            <h1 className=" font-bold text-black text-3xl">
              {session.user.name}
            </h1>
            <p>{session.user.email}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className=" space-y-4">
        <TabsList className=" grid w-full grid-cols-5">
          <TabsTrigger value="profile">
            <User />
            <span className=" max-sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield />
            <span className=" max-sm:hidden">Security</span>
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Key />
            <span className=" max-sm:hidden">Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="accounts">
            <LinkIcon />
            <span className=" max-sm:hidden">Accounts</span>
          </TabsTrigger>
          <TabsTrigger value="danger">
            <Trash className=" text-red-600" />
            <span className=" text-red-600 max-sm:hidden">Danger</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className=" ">
          <Card>
            <CardContent>
              <UpdateProfileForm user={session.user} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="">
          <Card>
            <CardContent>
              <LoadingSuspense>
                <SecurityTab
                  email={session.user.email}
                  isTwoFactorEnable={session.user.twoFactorEnabled ?? false}
                />
              </LoadingSuspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sessions" className="">
          <Card>
            <CardContent>
              <LoadingSuspense>
                <Set_session_Tab current_session={session.session.token} />
              </LoadingSuspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="accounts" className="">
          <Card>
            <CardContent>
              <LoadingSuspense>
                <LinkedAccountTab />
              </LoadingSuspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="danger" className=" ">
          <Account_deletion />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const SecurityTab = async ({
  email,
  isTwoFactorEnable,
}: {
  email: string;
  isTwoFactorEnable: boolean;
}) => {
  const [accounts, passkeys] = await Promise.all([
    await auth.api.listUserAccounts({
      headers: await headers(),
    }),
    await auth.api.listPasskeys({
      headers: await headers(),
    }),
  ]);

  const hasPasswordAccount = accounts.some(
    (account) => account.providerId === "credential",
  );
  return (
    <div>
      {hasPasswordAccount ? <ChangePassword /> : <SetPassword email={email} />}
      {hasPasswordAccount && (
        <TwoAuthFactor isTwoFactorEnable={isTwoFactorEnable} />
      )}
      <Card className="w-full max-w-md mx-auto" >
        <CardHeader>
          <CardTitle>Passkeys</CardTitle>
        </CardHeader>
        <CardContent>
          <PasskeyManagement passkeys={passkeys}/>
        </CardContent>
      </Card>
    </div>
  );
};

const LinkedAccountTab = async () => {
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  const nonCredentials = accounts.filter((a) => a.providerId !== "credential");

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <AccountLinking currentAccounts={nonCredentials} />
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

async function LoadingSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<Loader2 className=" animate-spin size-4" />}>
      {children}
    </Suspense>
  );
}
