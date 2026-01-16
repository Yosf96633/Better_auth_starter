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

type EmailVerificationProps = {
  verificationLink: string;
  userName?: string;
  companyName: string;
};

const EmailVerification = ({
  verificationLink,
  userName = "there",
  companyName,
}: EmailVerificationProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-[#f5f6f7] font-sans py-[50px]">
          <Container className="mx-auto max-w-[480px]">
            <Section className="bg-white rounded-[16px] shadow-sm mx-[16px] px-[40px] py-[50px] space-y-4">
              {/* Logo */}
              <Section className="text-center mb-[32px]">
                <Img
                  src="https://placehold.co/48x48/1a1a1a/white?text=BA"
                  alt="Company Logo"
                  width="48"
                  height="48"
                  className="w-[48px] h-[48px] rounded-full mx-auto object-cover"
                />
              </Section>

              {/* Title */}
              <Heading className="text-[28px] font-bold text-[#1a1a1a] text-center mb-[26px] m-0 leading-[1.2]">
                Confirm your email
              </Heading>

              {/* Greeting */}
              <Text className="text-[16px] text-[#1a1a1a] text-center mb-[26px] m-0 leading-[1.5]">
                Hi {userName}! 👋
              </Text>

              {/* Description */}
              <Text className="text-[16px] text-[#666666] text-center mb-[32px] m-0 leading-[1.5]">
                You're almost there! We just need to confirm your email address
                to create your account.
              </Text>

              {/* CTA Button */}
              <Section className="text-center mb-[32px]">
                <Button
                  href={verificationLink}
                  className="bg-[#1a1a1a] text-white px-[12px] py-[8px] rounded-[24px] text-[16px] font-medium no-underline box-border inline-block"
                >
                  Confirm Email
                </Button>
              </Section>

              {/* Alternative Link */}
              <Text className="text-[13px] text-[#999999] text-center mb-[32px] m-0 leading-[1.4]">
                Or copy and paste this link into your browser:
                <br />
                <span className="text-[#1a1a1a] break-all">
                  {verificationLink}
                </span>
              </Text>

              {/* Footer */}
              <Text className="text-[14px] text-[#666666] text-center m-0 leading-[1.4]">
                See you there,
                <br />
                The {companyName} Team
              </Text>

              {/* Security Notice */}
              <Text className="text-[12px] text-[#999999] text-center mt-[32px] m-0 leading-[1.4] border-t border-[#e5e5e5] pt-[24px]">
                If you didn't create an account, you can safely ignore this
                email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
export default EmailVerification;
