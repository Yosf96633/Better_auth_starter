import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ImpersonationIndicator } from "@/components/stop-impersonate";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Better Auth - Secure Authentication",
  description: "Modern authentication system with advanced security features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans selection:bg-blue-600 selection:text-white antialiased`}
      >
        {children}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton
          toastOptions={{
            classNames: {
              toast: "font-sans",
              title: "font-medium",
              description: "text-sm",
            },
          }}
        />
        <ImpersonationIndicator />
      </body>
    </html>
  );
}