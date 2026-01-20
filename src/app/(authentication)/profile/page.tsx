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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session === null) {
    redirect("/auth/login");
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-5xl">
        {/* Back Button */}
        <div className="mb-6 sm:mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
        </div>

        {/* Profile Header */}
        <Card className="mb-6 sm:mb-8 shadow-lg border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-slate-200 dark:ring-slate-800 shrink-0">
                <AvatarImage 
                  src={session.user.image || undefined} 
                  alt={session.user.name} 
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white text-2xl sm:text-3xl">
                  {getInitials(session.user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h1 className="font-bold text-slate-900 dark:text-slate-100 text-2xl sm:text-3xl truncate">
                  {session.user.name}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1 truncate">
                  {session.user.email}
                </p>
                <Badge 
                  className="mt-2 capitalize"
                  variant={session.user.role === "admin" ? "default" : "secondary"}
                >
                  {session.user.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-slate-200/50 dark:bg-slate-800/50">
            <TabsTrigger 
              value="profile" 
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">Profile</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
            >
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">Security</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sessions"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
            >
              <Key className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">Sessions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="accounts"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
            >
              <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">Accounts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="danger"
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-2.5 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900"
            >
              <Trash className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
              <span className="text-xs sm:text-sm text-red-600 dark:text-red-400">Danger</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="shadow-lg border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-xl">Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <UpdateProfileForm user={session.user} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-4">
              <LoadingSuspense>
                <SecurityTab
                  email={session.user.email}
                  isTwoFactorEnable={session.user.twoFactorEnabled ?? false}
                />
              </LoadingSuspense>
            </div>
          </TabsContent>

          <TabsContent value="sessions">
            <Card className="shadow-lg border-slate-200 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-xl">Active Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <LoadingSuspense>
                  <Set_session_Tab current_session={session.session.token} />
                </LoadingSuspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts">
            <LoadingSuspense>
              <LinkedAccountTab />
            </LoadingSuspense>
          </TabsContent>

          <TabsContent value="danger">
            <Account_deletion />
          </TabsContent>
        </Tabs>
      </div>
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
    <div className="space-y-4">
      <Card className="shadow-lg border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl">Password</CardTitle>
        </CardHeader>
        <CardContent>
          {hasPasswordAccount ? <ChangePassword /> : <SetPassword email={email} />}
        </CardContent>
      </Card>

      {hasPasswordAccount && (
        <Card className="shadow-lg border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <TwoAuthFactor isTwoFactorEnable={isTwoFactorEnable} />
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl">Passkeys</CardTitle>
        </CardHeader>
        <CardContent>
          <PasskeyManagement passkeys={passkeys} />
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
    <Card className="shadow-lg border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-xl">Linked Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <AccountLinking currentAccounts={nonCredentials} />
      </CardContent>
    </Card>
  );
};

async function LoadingSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-slate-400" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}