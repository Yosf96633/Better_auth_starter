"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Passkey } from "@better-auth/passkey";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Trash2, Plus, Key, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useState } from "react";

const passkeySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
});

type PasskeyForm = z.infer<typeof passkeySchema>;

export function PasskeyManagement({ passkeys }: { passkeys: Passkey[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const form = useForm<PasskeyForm>({
    resolver: zodResolver(passkeySchema),
    defaultValues: {
      name: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleAddPasskey(data: PasskeyForm) {
    await authClient.passkey.addPasskey(data, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to add passkey");
      },
      onSuccess: () => {
        toast.success("Passkey added successfully!");
        form.reset();
        router.refresh();
        setIsDialogOpen(false);
      },
    });
  }

  function handleDeletePasskey(passkeyId: string, passkeyName: string) {
    return authClient.passkey.deletePasskey(
      { id: passkeyId },
      {
        onSuccess: () => {
          toast.success(`Passkey "${passkeyName}" deleted`);
          router.refresh();
        },
        onError: (error) => {
          toast.error(error.error.message || "Failed to delete passkey");
        },
      }
    );
  }

  return (
    <div className="space-y-4">
      {passkeys.length === 0 ? (
        <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
          <Key className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
            No passkeys yet
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add your first passkey for secure, passwordless authentication
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {passkeys.map((passkey) => (
            <Card key={passkey.id} className="border-slate-200 dark:border-slate-800">
              <CardHeader className="">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base flex items-center gap-2 mb-1">
                      <Key className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span className="truncate">{passkey.name}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1.5 text-xs">
                      <Calendar className="h-3 w-3" />
                      Created {new Date(passkey.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </CardDescription>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete passkey</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Passkey</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the passkey "{passkey.name}"? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeletePasskey(passkey.id, passkey.name ?? "")}
                          className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(o) => {
          if (o) form.reset();
          setIsDialogOpen(o);
        }}
      >
        <DialogTrigger asChild>
          <Button className="w-full" size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Add New Passkey
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Passkey</DialogTitle>
            <DialogDescription>
              Create a new passkey for secure, passwordless authentication.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleAddPasskey)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passkey Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., My MacBook Pro" 
                        disabled={isSubmitting}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground">
                      Give this passkey a memorable name
                    </p>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Passkey
                  </>
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}