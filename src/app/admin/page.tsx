import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { ArrowLeft, Users } from "lucide-react"
import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { UserRow } from "./_components/user-row"

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session == null) return redirect("/auth/login")
  const hasAccess = await auth.api.userHasPermission({
    headers: await headers(),
    body: { permission: { user: ["list"] } },
  })
  if (!hasAccess.success) return redirect("/")

  const users = await auth.api.listUsers({
    headers: await headers(),
    query: { limit: 100, sortBy: "createdAt", sortDirection: "desc" },
  })

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="gap-2 -ml-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
        </div>

        <Card className="shadow-lg border-slate-200 dark:border-slate-800">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-2xl">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <span>User Management</span>
              </div>
              <span className="text-lg font-normal text-muted-foreground">
                ({users.total} {users.total === 1 ? 'user' : 'users'})
              </span>
            </CardTitle>
            <CardDescription className="text-base">
              Manage user accounts, roles, and permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 sm:px-6">
            <div className="rounded-md border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                      <TableHead className="font-semibold">User</TableHead>
                      <TableHead className="font-semibold hidden sm:table-cell">Role</TableHead>
                      <TableHead className="font-semibold hidden md:table-cell">Created</TableHead>
                      <TableHead className="font-semibold w-16 sm:w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.users.length > 0 ? (
                      users.users.map(user => (
                        <UserRow key={user.id} user={user} selfId={session.user.id} />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}