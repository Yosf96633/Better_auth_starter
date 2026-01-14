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
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useState } from "react";
import { Eye, EyeOff, Loader2, LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { APIError } from "better-auth";
import { GoogleIcon } from "@/icons/GoogleIcon";
import { GithubIcon } from "@/icons/GithubIcon";

const formSchema = z.object({
  username: z
    .string()
    .min(2, "Username must be greater than 2 characters!")
    .max(50, "Username must be lesser than 50 characters!"),
  email: z.string().email("Please enter valid email!"),
  password: z
    .string()
    .min(8, "Password must be greater than 8 characters!")
    .max(20, "Password must be lesser than 20 characters!"),
});

interface SignupFormProps extends React.ComponentProps<"div"> {
  onSignupSuccess?: (email: string) => void;
  onSwitchToLogin?: () => void;
}

export function SignupForm({
  className,
  onSignupSuccess,
  onSwitchToLogin,
  ...props
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isGithubLoading, setIsGithubLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await authClient.signUp.email(
      {
        name: values.username,
        email: values.email,
        password: values.password,
      },
      {
        onError: (context) => {
          toast.error(context.error.message);
          console.log("Error at sign up form : ", context.error);
        },
        onSuccess: async () => {
          // Reset the form fields
          form.reset();

          // Show the success toast
          toast.success("Sign up successful! 🎉 Please verify your email.");

          // Switch to verification tab
          onSignupSuccess?.(values.email);
        },
      }
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
        }
      );
      console.log("Data : ", data);
      console.log("Error : ", error);
    } catch (error) {
      console.log(
        `Error at the Signup form during ${provider} signup : `,
        error
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
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription>Sign up with your social account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                {/* Horizontal Social Buttons with Separator */}
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
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Field>
                  <Button disabled={isLoading} type="submit" className="w-full">
                    {isLoading ? (
                      <LoaderCircle className="animate-spin size-4" />
                    ) : (
                      "Sign up"
                    )}
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={onSwitchToLogin}
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      Log in
                    </button>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
