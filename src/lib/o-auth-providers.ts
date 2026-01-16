
import { GithubIcon } from "@/icons/GithubIcon";
import { GoogleIcon } from "@/icons/GoogleIcon";
import { ComponentProps, ElementType } from "react"

export const SUPPORTED_OAUTH_PROVIDERS = ["github", "google"] as const
export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number]

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
  SupportedOAuthProvider,
  { name: string; Icon: ElementType<ComponentProps<'svg'>> }
> = {
  google: { name: "Google", Icon: GoogleIcon },
  github: { name: "GitHub", Icon: GithubIcon },
}