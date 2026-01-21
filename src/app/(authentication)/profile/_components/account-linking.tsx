"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
  SupportedOAuthProvider,
} from "@/lib/o-auth-providers";
import { Plus, Shield, Trash2, Link2, Calendar, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useState } from "react";

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];

export function AccountLinking({
  currentAccounts,
}: {
  currentAccounts: Account[];
}) {
  const availableProviders = SUPPORTED_OAUTH_PROVIDERS.filter(
    (provider) => !currentAccounts.find((acc) => acc.providerId === provider)
  );

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
        <Link2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
            Account Linking
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Connect multiple accounts for easier sign-in options. You can use any linked account to access your profile.
          </p>
        </div>
      </div>

      {/* Linked Accounts Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Linked Accounts ({currentAccounts.length})
        </h3>

        {currentAccounts.length === 0 ? (
          <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
              No linked accounts
            </p>
            <p className="text-sm text-muted-foreground">
              Link an account below for easier sign-in
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentAccounts.map((account) => (
              <AccountCard
                key={account.id}
                provider={account.providerId}
                account={account}
              />
            ))}
          </div>
        )}
      </div>

      {/* Available Providers Section */}
      {availableProviders.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Available to Link ({availableProviders.length})
          </h3>
          <div className="grid gap-3">
            {availableProviders.map((provider) => (
              <AccountCard key={provider} provider={provider} />
            ))}
          </div>
        </div>
      )}

      {availableProviders.length === 0 && currentAccounts.length > 0 && (
        <div className="text-center py-6 px-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
          <p className="text-sm text-muted-foreground">
            All available accounts are linked
          </p>
        </div>
      )}
    </div>
  );
}

function AccountCard({
  provider,
  account,
}: {
  provider: string;
  account?: Account;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const providerDetails = SUPPORTED_OAUTH_PROVIDER_DETAILS[
    provider as SupportedOAuthProvider
  ] ?? {
    name: provider,
    Icon: Shield,
  };

  async function linkAccount() {
    try {
      setIsLoading(true);
      await authClient.linkSocial({
        provider,
        callbackURL: "/profile",
      });
    } catch (error) {
      toast.error("Failed to link account");
      setIsLoading(false);
    }
  }

  function unlinkAccount() {
    if (account == null) {
      return Promise.resolve({ error: { message: "Account not found" } });
    }
    
    setIsLoading(true);
    return authClient.unlinkAccount(
      {
        accountId: account.accountId,
        providerId: provider,
      },
      {
        onSuccess: () => {
          toast.success(`${providerDetails.name} account unlinked`);
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.error.message || "Failed to unlink account");
          setIsLoading(false);
        },
      }
    );
  }

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shrink-0">
              <providerDetails.Icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                {providerDetails.name}
              </p>
              {account == null ? (
                <p className="text-sm text-muted-foreground">
                  Not connected
                </p>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Linked {new Date(account.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              )}
            </div>
          </div>
          {account == null ? (
            <Button
              variant="outline"
              size="sm"
              onClick={linkAccount}
              disabled={isLoading}
              className="shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Linking...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Link
                </>
              )}
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isLoading}
                  className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Unlink
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unlink {providerDetails.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You won't be able to sign in using your {providerDetails.name} account anymore. 
                    You can always link it again later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={unlinkAccount}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Unlinking...
                      </>
                    ) : (
                      "Unlink Account"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}