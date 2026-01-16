"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Eye, EyeOff, Loader2, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code"

type TwoFactorData = { totpURI: string; backupCodes: string[] };
const twoFactorAuthSchema = z.object({
  password: z.string(),
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
      toast.error(result.error.message);
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
        onSuccess(context) {
          toast.success(`Disable 2FA successfully`);
        },
        onError: async (ctx) => {
          form.reset();
          toast.error(ctx.error.message);
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
    <div className=" flex justify-center p-4 items-center">
      <Card className="w-full max-w-md">
        <CardHeader className=" flex justify-between">
          <CardTitle>Two Factor Authentication</CardTitle>
          <Badge variant={isTwoFactorEnable ? "default" : "secondary"}>
            {isTwoFactorEnable ? "Enable" : "Disable"}
          </Badge>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                isTwoFactorEnable
                  ? handleDisableTwoFactorAuth
                  : handleEnableTwoFactorAuth
              )}
              className="space-y-4"
            >
              {/* Current Password */}
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
                          placeholder="••••••••"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
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

              <Button disabled={isLoading} variant={isTwoFactorEnable?"destructive":"default"} type="submit" className="w-full">
                {isLoading ? (
                  <LoaderCircle className="animate-spin size-4" />
                ) : isTwoFactorEnable ? (
                  "Disable 2FA"
                ) : (
                  "Enable 2FA"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoAuthFactor;



const qrSchema = z.object({
  token: z.string().length(6),
})

type QrForm = z.infer<typeof qrSchema>
function QRCodeVerify({
  totpURI,
  backupCodes,
  onDone,
}: TwoFactorData & { onDone: () => void }) {
  const [successfullyEnabled, setSuccessfullyEnabled] = useState(false)
  const router = useRouter()
  const form = useForm<QrForm>({
    resolver: zodResolver(qrSchema),
    defaultValues: { token: "" },
  })

  const { isSubmitting } = form.formState

  async function handleQrCode(data: QrForm) {
    await authClient.twoFactor.verifyTotp(
      {
        code: data.token,
      },
      {
        onError: error => {
          toast.error(error.error.message || "Failed to verify code")
        },
        onSuccess: () => {
          setSuccessfullyEnabled(true)
          router.refresh()
        },
      }
    )
  }

  if (successfullyEnabled) {
    return (
      <>
        <p className="text-sm text-muted-foreground mb-2">
          Save these backup codes in a safe place. You can use them to access
          your account.
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {backupCodes.map((code, index) => (
            <div key={index} className="font-mono text-sm">
              {code}
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={onDone}>
          Done
        </Button>
      </>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Scan this QR code with your authenticator app and enter the code below:
      </p>

      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleQrCode)}>
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="w-full">
             {
                isSubmitting ? <Loader2 className=" animate-spin size-4"/> : "Submit"
             }
          </Button>
        </form>
      </Form>
      <div className="p-4 bg-white w-fit text-center">
        <QRCode size={256} value={totpURI} />
      </div>
    </div>
  )
}
