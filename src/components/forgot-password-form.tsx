"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useState } from "react";
import { ArrowLeft, LoaderCircle, KeyRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email!"),
});

interface ForgotPasswordFormProps extends React.ComponentProps<"div"> {
  onBackToLogin?: () => void;
}

export function ForgotPasswordForm({
  className,
  onBackToLogin,
  ...props
}: ForgotPasswordFormProps) {
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: "/auth/reset-password",
      });

      toast.success("Password reset link sent! Check your email.");
      setEmailSent(true);
      form.reset();
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast.error("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Forgot Password?</CardTitle>
          <CardDescription>
            {emailSent
              ? "Check your email for reset instructions"
              : "Enter your email to receive a password reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailSent ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4 text-center text-sm">
                <p className="mb-2">
                  We&apos;ve sent a password reset link to your email address.
                </p>
                <p className="text-muted-foreground">
                  Please check your inbox and spam folder.
                </p>
              </div>
              <Button
                onClick={onBackToLogin}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Field>
                    <Button
                      disabled={isLoading}
                      type="submit"
                      className="w-full"
                    >
                      {isLoading ? (
                        <LoaderCircle className="animate-spin size-4" />
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                    <FieldDescription className="text-center">
                      <button
                        type="button"
                        onClick={onBackToLogin}
                        className="underline underline-offset-4 hover:text-primary"
                      >
                        <ArrowLeft className="inline mr-1 h-3 w-3" />
                        Back to Login
                      </button>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
