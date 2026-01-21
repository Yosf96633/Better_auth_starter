"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { authClient } from "@/lib/auth-client";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Account_deletion = () => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const CONFIRM_TEXT = "DELETE";
  const isConfirmed = confirmText === CONFIRM_TEXT;

  const handleDeleteAccount = async () => {
    if (!isConfirmed) {
      toast.error("Please type DELETE to confirm");
      return;
    }

    try {
      setIsDeleting(true);
      await authClient.deleteUser(
        {},
        {
          onSuccess: () => {
            toast.success("Account deleted successfully");
            setOpen(false);
            router.push("/");
          },
          onError: (error) => {
            toast.error(error.error.message || "Failed to delete account");
            setIsDeleting(false);
          },
        }
      );
    } catch (error) {
      toast.error("An unexpected error occurred");
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmText("");
    }
    setOpen(newOpen);
  };

  return (
    <Card className="border-2 border-red-200 dark:border-red-900 shadow-lg">
      <CardHeader className=" mt-6 max-sm:mt-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950/50">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <CardTitle className="text-red-600 dark:text-red-400">
              Danger Zone
            </CardTitle>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1 font-normal">
              Irreversible actions that affect your account
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">
            Delete Account
          </h3>
          <p className="text-sm text-muted-foreground">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                This will permanently delete:
              </p>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
                <li>Your profile and account information</li>
                <li>All your linked accounts and sessions</li>
                <li>Your data and settings</li>
                <li>Access to all services</li>
              </ul>
            </div>
          </div>
        </div>

        <AlertDialog open={open} onOpenChange={handleOpenChange}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="lg" className="w-full sm:w-auto">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account Permanently
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950/50">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <AlertDialogTitle>Delete Your Account?</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="space-y-3">
                <p>
                  This action is <strong>permanent and irreversible</strong>. All your data will be deleted immediately and cannot be recovered.
                </p>
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-3">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    To confirm, type <strong className="font-mono">{CONFIRM_TEXT}</strong> below:
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-delete" className="sr-only">
                Type DELETE to confirm
              </Label>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={`Type ${CONFIRM_TEXT} to confirm`}
                disabled={isDeleting}
                className="font-mono"
                autoComplete="off"
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={isDeleting || !isConfirmed}
                className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting Account...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete My Account
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default Account_deletion;