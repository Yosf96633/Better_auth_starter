'use client'

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card className="w-full mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          We'll send a password reset link to <strong>{email}</strong>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Click the button below to receive a password reset link. Check your inbox and follow the instructions to set a new password.
        </p>

        <Button
          onClick={handleSetPassword}
          className="w-full"
          disabled={cooldown > 0 || loading}
        >
          {loading
            ? "Sending..."
            : cooldown > 0
            ? `Resend in ${cooldown}s`
            : "Send Reset Link"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SetPassword;
