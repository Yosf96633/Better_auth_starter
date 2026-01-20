"use client";

import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, Shield, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code";

type TwoFactorData = { totpURI: string; backupCodes: string[] };

const twoFactorAuthSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

const TwoAuthFactor = ({
  isTwoFactorEnable,
}: {
  isTwoFactorEnable: boolean;
}) => {
  const form = useForm<z.infer<typeof twoFactorAuthSchema>>({
    resolver: zodResolver(twoFactorAuthSchema),
    defaultValues: {
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(
    null
  );

  const handleEnableTwoFactorAuth = async (
    values: z.infer<typeof twoFactorAuthSchema>
  ) => {
    const result = await authClient.twoFactor.enable({
      password: values.password,
    });

    if (result.error) {
      toast.error(result.error.message || "Failed to enable 2FA");
      form.reset();
    } else {
      setTwoFactorData(result.data);
      form.reset();
    }
  };

  const handleDisableTwoFactorAuth = async (
    values: z.infer<typeof twoFactorAuthSchema>
  ) => {
    await authClient.twoFactor.disable(
      {
        password: values.password,
      },
      {
        onSuccess() {
          toast.success("Two-factor authentication disabled");
          router.refresh();
        },
        onError: async (ctx) => {
          form.reset();
          toast.error(ctx.error.message || "Failed to disable 2FA");
        },
      }
    );
  };

  if (twoFactorData != null) {
    return (
      <QRCodeVerify onDone={() => setTwoFactorData(null)} {...twoFactorData} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
        <Shield className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Two-Factor Authentication
            </p>
            <Badge variant={isTwoFactorEnable ? "default" : "secondary"} className="text-xs">
              {isTwoFactorEnable ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {isTwoFactorEnable
              ? "Your account is protected with 2FA"
              : "Add an extra layer of security to your account"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            isTwoFactorEnable
              ? handleDisableTwoFactorAuth
              : handleEnableTwoFactorAuth
          )}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      disabled={isLoading}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isLoading}
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      tabIndex={-1}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showCurrentPassword
                          ? "Hide password"
                          : "Show password"}
                      </span>
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={isLoading}
            variant={isTwoFactorEnable ? "destructive" : "default"}
            type="submit"
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isTwoFactorEnable ? "Disabling..." : "Enabling..."}
              </>
            ) : isTwoFactorEnable ? (
              "Disable 2FA"
            ) : (
              "Enable 2FA"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TwoAuthFactor;

const qrSchema = z.object({
  token: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d+$/, "Code must only contain numbers"),
});

type QrForm = z.infer<typeof qrSchema>;

function QRCodeVerify({
  totpURI,
  backupCodes,
  onDone,
}: TwoFactorData & { onDone: () => void }) {
  const [successfullyEnabled, setSuccessfullyEnabled] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<QrForm>({
    resolver: zodResolver(qrSchema),
    defaultValues: { token: "" },
  });

  const { isSubmitting } = form.formState;

  async function handleQrCode(data: QrForm) {
    await authClient.twoFactor.verifyTotp(
      {
        code: data.token,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Invalid code. Please try again.");
        },
        onSuccess: () => {
          setSuccessfullyEnabled(true);
          toast.success("Two-factor authentication enabled!");
          router.refresh();
        },
      }
    );
  }

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (successfullyEnabled) {
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
          <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
            Two-factor authentication enabled!
          </p>
          <p className="text-sm text-green-700 dark:text-green-300">
            Save these backup codes in a safe place. You can use them to access your account if you lose access to your authenticator app.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {backupCodes.map((code, index) => (
            <Button
              key={index}
              variant="outline"
              className="font-mono text-sm justify-between h-auto py-2.5"
              onClick={() => copyCode(code)}
            >
              {code}
              {copiedCode === code ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          ))}
        </div>

        <Button variant="default" onClick={onDone} className="w-full" size="lg">
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          Scan this QR code with your authenticator app (such as Google Authenticator or Authy), then enter the 6-digit code below to complete setup.
        </p>
      </div>

      <div className="flex justify-center p-6 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
        <QRCode size={200} value={totpURI} />
      </div>

      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleQrCode)}>
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="000000"
                    className="text-center text-lg tracking-widest font-mono"
                    maxLength={6}
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-muted-foreground text-center">
                  Enter the 6-digit code from your authenticator app
                </p>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify & Enable"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}