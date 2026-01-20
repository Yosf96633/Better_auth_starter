import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import arcjet, {
  BotOptions,
  EmailOptions,
  shield,
  SlidingWindowRateLimitOptions,
  protectSignup,
  detectBot,
  slidingWindow,
} from "@arcjet/next";
import { findIp } from "@arcjet/ip";

// export const { GET, POST } = toNextJsHandler(auth);

const authHandler = toNextJsHandler(auth);

const aj = arcjet({
  key: process.env.ARCJET_KEY! as string,
  rules: [shield({ mode: "LIVE" })],
  characteristics: ["userIdOrIp"],
});

const botSetting = { mode: "LIVE", allow: [] } satisfies BotOptions;
const restrictiveLimitSetting = {
  mode: "LIVE",
  max: 10,
  interval: "10m",
} satisfies SlidingWindowRateLimitOptions<[]>;
const laxLimitSetting = {
  mode: "LIVE",
  max: 60,
  interval: "1m",
} satisfies SlidingWindowRateLimitOptions<[]>;

const emailSetting = {
  mode: "LIVE",
  block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

export const { GET } = authHandler;

export async function POST(request: Request) {
  const decision = await checkArcjet(request);
  console.log("Decision in POST : ", decision);
  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return Response.json({ message: `Too Many Requests!` }, { status: 429 });
    } else if (decision.reason.isEmail()) {
      let message: string;

      if (decision.reason.emailTypes.includes("INVALID")) {
        message = "Email address format is invalid.";
      } else if (decision.reason.emailTypes.includes("DISPOSABLE")) {
        message = "Disposable email addresses are not allowed.";
      } else if (decision.reason.emailTypes.includes("NO_MX_RECORDS")) {
        message = "Email domain is not valid.";
      } else {
        message = "Invalid email.";
      }
      return Response.json({ message }, { status: 400 });
    } else {
      return Response.json({ message: `Forbidden` }, { status: 403 });
    }
  }
  return authHandler.POST(request);
}

async function checkArcjet(request: Request) {
  console.log("Request in checkArcjet : ", request);

  // Clone the request before reading the body
  const clonedRequest = request.clone();
  const body = (await clonedRequest.json()) as unknown;
  console.log("Body in checkArcjet : ", body);

  const session = await auth.api.getSession({
    headers: request.headers,
  });
  console.log("Session in checkArcjet : ", session);
  const userIdOrIp = (session?.user.id ?? findIp(request)) || `127.0.0.1`;
  console.log("userIdOrIp in checkArcjet : ", userIdOrIp);

  if (request.url.endsWith("/auth/sign-up/email") || request.url.endsWith("/auth/sign-in/email")) {
    if (
      body &&
      typeof body === "object" &&
      "email" in body &&
      typeof body.email === "string"
    ) {
      return aj
        .withRule(
          protectSignup({
            bots: botSetting,
            rateLimit: restrictiveLimitSetting,
            email: emailSetting,
          })
        )
        .protect(request, { email: body.email, userIdOrIp });
    } else {
      return aj
        .withRule(detectBot(botSetting))
        .withRule(slidingWindow(restrictiveLimitSetting))
        .protect(request, { userIdOrIp });
    }
  }

  return aj
    .withRule(detectBot(botSetting))
    .withRule(slidingWindow(laxLimitSetting))
    .protect(request, { userIdOrIp });
}
