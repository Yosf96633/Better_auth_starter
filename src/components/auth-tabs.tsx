"use client";
import { useState } from "react";
import { Tabs, TabsContent} from "@/components/ui/tabs";
import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";
import { EmailVerificationTab } from "@/components/email-verification-tab";
type AuthTab = "login" | "signup" | "verification";
export function AuthTabs() {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [userEmail, setUserEmail] = useState<string>("");
  const handleEmailNotVerified = (email: string) => {
    setUserEmail(email);
    setActiveTab("verification");
  };

  const handleSignupSuccess = (email: string) => {
    setUserEmail(email);
    setActiveTab("verification");
  };

  const handleSwitchToLogin = () => {
    setActiveTab("login");
  };

  const handleSwitchToSignup = () => {
    setActiveTab("signup");
  };

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsContent value="login" className="mt-0">
        <LoginForm
          onEmailNotVerified={handleEmailNotVerified}
          onSwitchToSignup={handleSwitchToSignup}
        />
      </TabsContent>

      <TabsContent value="signup" className="mt-0">
        <SignupForm
          onSignupSuccess={handleSignupSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
      </TabsContent>

      <TabsContent value="verification" className="mt-0">
        <EmailVerificationTab
          email={userEmail}
          onBackToLogin={handleSwitchToLogin}
        />
      </TabsContent>
    </Tabs>
  );
}
