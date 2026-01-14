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

  const handleGoogleSignup = async () => {
    try {
      setIsGoogleLoading(true);
      const { data, error } = await authClient.signIn.social(
        {
          provider: "google",
        },
        {
          onSuccess(context) {
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
      console.log("Error at the Signup form during Google signup : ", error);
      if (error instanceof APIError) {
        toast.error(error.message);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription>Sign up with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <Button
                    onClick={handleGoogleSignup}
                    variant="outline"
                    type="button"
                  >
                    {isGoogleLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                          />
                        </svg>
                        <span>Sign up with Google</span>
                      </>
                    )}
                  </Button>
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
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
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