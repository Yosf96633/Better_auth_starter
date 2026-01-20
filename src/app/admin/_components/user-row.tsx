"use client"

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
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import { authClient } from "@/lib/auth-client"
import { UserWithRole } from "better-auth/plugins/admin"
import { 
  MoreHorizontal, 
  UserCog, 
  LogOut, 
  Ban, 
  UserCheck, 
  Trash2 
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserRow({
  user,
  selfId,
}: {
  user: UserWithRole
  selfId: string
}) {
  const { refetch } = authClient.useSession()
  const router = useRouter()
  const isSelf = user.id === selfId

  function handleImpersonateUser(userId: string) {
    authClient.admin.impersonateUser(
      { userId },
      {
        onError: error => {
          toast.error(error.error.message || "Failed to impersonate")
        },
        onSuccess: () => {
          toast.success("Now impersonating user")
          refetch()
          router.push("/")
        },
      }
    )
  }

  function handleBanUser(userId: string) {
    authClient.admin.banUser(
      { userId },
      {
        onError: error => {
          toast.error(error.error.message || "Failed to ban user")
        },
        onSuccess: () => {
          toast.success("User banned successfully")
          router.refresh()
        },
      }
    )
  }

  function handleUnbanUser(userId: string) {
    authClient.admin.unbanUser(
      { userId },
      {
        onError: error => {
          toast.error(error.error.message || "Failed to unban user")
        },
        onSuccess: () => {
          toast.success("User unbanned successfully")
          router.refresh()
        },
      }
    )
  }

  function handleRevokeSessions(userId: string) {
    authClient.admin.revokeUserSessions(
      { userId },
      {
        onError: error => {
          toast.error(error.error.message || "Failed to revoke user sessions")
        },
        onSuccess: () => {
          toast.success("User sessions revoked successfully")
        },
      }
    )
  }

  function handleRemoveUser(userId: string) {
    authClient.admin.removeUser(
      { userId },
      {
        onError: error => {
          toast.error(error.error.message || "Failed to delete user")
        },
        onSuccess: () => {
          toast.success("User deleted successfully")
          router.refresh()
        },
      }
    )
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <TableRow key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
      <TableCell>
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white text-sm">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
              {user.name || "No name"}
            </div>
            <div className="text-sm text-muted-foreground truncate">
              {user.email}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {user.banned && (
                <Badge variant="destructive" className="text-xs">
                  Banned
                </Badge>
              )}
              {!user.emailVerified && (
                <Badge variant="outline" className="text-xs">
                  Unverified
                </Badge>
              )}
              {isSelf && (
                <Badge className="text-xs bg-blue-600 hover:bg-blue-700">
                  You
                </Badge>
              )}
              <Badge 
                variant={user.role === "admin" ? "default" : "secondary"} 
                className="text-xs sm:hidden"
              >
                {user.role}
              </Badge>
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        <Badge 
          variant={user.role === "admin" ? "default" : "secondary"}
          className="capitalize"
        >
          {user.role}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">
        {new Date(user.createdAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </TableCell>
      <TableCell>
        {!isSelf && (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  User Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => handleImpersonateUser(user.id)}
                  className="gap-2"
                >
                  <UserCog className="h-4 w-4" />
                  Impersonate
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleRevokeSessions(user.id)}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Revoke Sessions
                </DropdownMenuItem>
                {user.banned ? (
                  <DropdownMenuItem 
                    onClick={() => handleUnbanUser(user.id)}
                    className="gap-2"
                  >
                    <UserCheck className="h-4 w-4" />
                    Unban User
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem 
                    onClick={() => handleBanUser(user.id)}
                    className="gap-2"
                  >
                    <Ban className="h-4 w-4" />
                    Ban User
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="gap-2 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400">
                    <Trash2 className="h-4 w-4" />
                    Delete User
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <strong>{user.name || user.email}</strong>? 
                  This action cannot be undone and will permanently remove their account and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleRemoveUser(user.id)}
                  className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  Delete User
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </TableCell>
    </TableRow>
  )
}