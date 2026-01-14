// emails/password-reset.tsx
import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Heading,
  Text,
  Button,
  Tailwind,
} from "@react-email/components";

interface PasswordResetProps {
  resetLink: string;
  userName?: string;
  expirationTime?: string;
  companyName: string;
}

const PasswordReset = ({
  resetLink,
  userName = "there",
  expirationTime = "1 hour",
  companyName,
}: PasswordResetProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-[#f5f6f7] font-sans py-[50px]">
          <Container className="mx-auto max-w-[480px]">
            <Section className="bg-white rounded-[16px] shadow-sm mx-[16px] px-[40px] py-[50px]">
              {/* Logo */}
              <Section className="text-center mb-[38px]">
                <Img
                  src="https://placehold.co/48x48/1a1a1a/white?text=BA"
                  alt="Company Logo"
                  width="48"
                  height="48"
                  className="w-[48px] h-[48px] rounded-full mx-auto object-cover"
                />
              </Section>

              {/* Title */}
              <Heading className="text-[28px] font-bold text-[#1a1a1a] text-center mb-[28px] m-0 leading-[1.2]">
                Reset your password
              </Heading>

              {/* Greeting */}
              <Text className="text-[16px] text-[#1a1a1a] text-center mb-[24px] m-0 leading-[1.5]">
                Hi {userName}! 🔐
              </Text>

              {/* Description */}
              <Text className="text-[16px] text-[#4a4a4a] text-center mb-[38px] m-0 leading-[1.5]">
                We received a request to reset the password for your account.
                Click the button below to set a new password.
              </Text>

              {/* CTA Button */}
              <Section className="text-center mb-[32px]">
                <Button
                  href={resetLink}
                  className="bg-[#1a1a1a] text-white px-[32px] py-[24px] rounded-[8px] text-[16px] font-medium no-underline box-border inline-block"
                >
                  Reset Password
                </Button>
              </Section>

              {/* Alternative Link */}
              <Text className="text-[13px] text-[#999999] text-center mb-[32px] m-0 leading-[1.4]">
                Or copy and paste this link into your browser:
                <br />
                <span className="text-[#1a1a1a] break-all">{resetLink}</span>
              </Text>

              {/* Security Note */}
              <Text className="text-[14px] text-[#666666] text-center mb-[28px] m-0 leading-[1.4]">
                This reset link will expire in {expirationTime}. If you did not
                request a password reset, you can safely ignore this email.
              </Text>

              {/* Footer */}
              <Text className="text-[14px] text-[#666666] text-center m-0 leading-[1.4]">
                Thanks,
                <br />
                The {companyName} Team
              </Text>

              {/* Security Notice */}
              <Text className="text-[12px] text-[#999999] text-center mt-[38px] m-0 leading-[1.4] border-t border-[#e5e5e5] pt-[24px]">
                For your security, this link can only be used once and will
                expire soon.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PasswordReset;
