"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

interface EmailVerificationTabProps {
  email: string;
  onBackToLogin: () => void;
}

export function EmailVerificationTab({ 
  email, 
  onBackToLogin 
}: EmailVerificationTabProps) {
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    // Start countdown when component mounts
    setCanResend(false);
    setCountdown(60);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      
      // Call your auth client to resend verification email
      await authClient.sendVerificationEmail({
        email,
      });

      toast.success("Verification email sent! Check your inbox.");
      
      // Reset countdown
      setCanResend(false);
      setCountdown(60);
      
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      console.error("Error resending verification email:", error);
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Verify Your Email</CardTitle>
          <CardDescription>
            We sent a verification link to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-center text-sm">
            <p className="mb-2">
              Please check your email and click the verification link to activate
              your account.
            </p>
            <p className="text-muted-foreground">
              Don&apos;t forget to check your spam folder!
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleResendEmail}
              disabled={!canResend || isResending}
              className="w-full"
              variant="outline"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : !canResend ? (
                `Resend Email (${countdown}s)`
              ) : (
                "Resend Verification Email"
              )}
            </Button>

            <Button
              onClick={onBackToLogin}
              variant="ghost"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}