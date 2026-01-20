"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Clock } from "lucide-react";

const COOLDOWN_SECONDS = 60;

const SetPassword = ({ email }: { email: string }) => {
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSetPassword = async () => {
    if (cooldown > 0 || loading) return;

    try {
      setLoading(true);

      await authClient.requestPasswordReset(
        {
          email,
          redirectTo: "/auth/reset-password",
        },
        {
          onSuccess: () => {
            toast.success("Password reset link sent to your email!");
            setCooldown(COOLDOWN_SECONDS);
          },
          onError: (context) => {
            toast.error(
              context.error.message || "Failed to send reset link"
            );
            console.error("Error requesting password reset:", context.error);
          },
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (cooldown === 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
        <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            No password set
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            We'll send a password reset link to{" "}
            <span className="font-medium">{email}</span>
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Click the button below to receive a password reset link. Check your inbox and follow the instructions to set a new password.
        </p>

        <Button
          onClick={handleSetPassword}
          className="w-full"
          size="lg"
          disabled={cooldown > 0 || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : cooldown > 0 ? (
            <>
              <Clock className="mr-2 h-4 w-4" />
              Resend in {cooldown}s
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Send Reset Link
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SetPassword;