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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
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
  FormDescription,
} from "./ui/form";
import { useState } from "react";
import { Eye, EyeOff, Loader2, LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { APIError } from "better-auth";
import { GoogleIcon } from "@/icons/GoogleIcon";
import { GithubIcon } from "@/icons/GithubIcon";
import { Separator } from "./ui/separator";
import { PasskeyButton } from "./passkey-button";

const formSchema = z.object({
  email: z.string().email("Please enter valid email!"),
  password: z
    .string()
    .min(8, "Password must be greater than 8 characters!")
    .max(20, "Password must be lesser than 20 characters!"),
});

interface LoginFormProps extends React.ComponentProps<"div"> {
  onEmailNotVerified?: (email: string) => void;
  onSwitchToSignup?: () => void;
  onSwitchToForgotPassword?: () => void;
}

export function LoginForm({
  className,
  onEmailNotVerified,
  onSwitchToSignup,
  onSwitchToForgotPassword,
  ...props
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isGithubLoading, setIsGithubLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onError: (context) => {
          const error = context.error;

          // Check for email not verified error
          if (error.status === 403 || error.code === "EMAIL_NOT_VERIFIED") {
            toast.error("Please verify your email before logging in.");
            onEmailNotVerified?.(values.email);
            return;
          }

          toast.error(error.message);
          console.log("Error at Login form : ", error);
        },
        onSuccess: async () => {
          form.reset();
          toast.success("Login successful! 🎉");
          setTimeout(() => {
            router.push("/");
          }, 1500);
        },
      },
    );
  };

  const handleSocialSignup = async (provider: "google" | "github") => {
    const setLoading =
      provider === "google" ? setIsGoogleLoading : setIsGithubLoading;

    try {
      setLoading(true);
      const { data, error } = await authClient.signIn.social(
        {
          provider: provider,
        },
        {
          onSuccess(context) {
            toast.success(`Successfully signed up with ${provider}! ✨🎉`);
            router.push("/");
          },
          onError(context) {
            toast.error(context.error.message);
          },
        },
      );
      console.log("Data : ", data);
      console.log("Error : ", error);
    } catch (error) {
      console.log(
        `Error at the Signup form during ${provider} signup : `,
        error,
      );
      if (error instanceof APIError) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Login to your Account</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => handleSocialSignup("google")}
                      variant="outline"
                      type="button"
                      className="flex-1"
                      disabled={isGoogleLoading || isGithubLoading}
                    >
                      {isGoogleLoading ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        <>
                          <GoogleIcon />
                          <span>Google</span>
                        </>
                      )}
                    </Button>

                    <Separator orientation="vertical" className="h-20" />

                    <Button
                      onClick={() => handleSocialSignup("github")}
                      variant="outline"
                      type="button"
                      className="flex-1"
                      disabled={isGoogleLoading || isGithubLoading}
                    >
                      {isGithubLoading ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        <>
                          <GithubIcon />
                          <span>Github</span>
                        </>
                      )}
                    </Button>
                  </div>
                </Field>

                <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                  Or continue with
                </FieldSeparator>
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription className="underline cursor-pointer text-end">
                        <button
                          type="button"
                          onClick={onSwitchToForgotPassword}
                          className="hover:text-primary"
                        >
                          Forgot password?
                        </button>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Field>
                  <Button
                    onMouseEnter={() => router.prefetch("/")}
                    disabled={isLoading}
                    type="submit"
                    className="w-full"
                  >
                    {isLoading ? (
                      <LoaderCircle className="animate-spin size-4" />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </Form>
          <PasskeyButton />
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up
            </button>
          </FieldDescription>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
