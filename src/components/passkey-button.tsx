"use client"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "./ui/button"

export function PasskeyButton() {
  const router = useRouter()
  const { refetch } = authClient.useSession()

  useEffect(() => {
    authClient.signIn.passkey(
      { autoFill: true },
      {
        onSuccess() {
          refetch()
          router.push("/")
        },
      }
    )
  }, [router, refetch])

  return (
    <Button
      variant="outline"
      className="w-full my-4"
      onClick={() =>
        authClient.signIn.passkey(undefined, {
          onSuccess() {
            refetch()
            router.push("/")
          },
        })
      }
    >
      Use Passkey
    </Button>
  )
}