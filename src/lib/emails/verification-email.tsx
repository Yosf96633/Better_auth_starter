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
  verificationLink = "https://example.com/verify?token=abc123",
  userName = "there",
  companyName = "BrandApp",
}: EmailVerificationProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-[#f5f6f7] font-sans m-0 p-0">
          <Container className="mx-auto my-0 py-[40px] px-[20px] max-w-[600px]">
            <Section className="bg-white rounded-[12px] shadow-sm mx-auto my-0 px-[24px] py-[40px] sm:px-[48px] sm:py-[56px]">
              {/* Logo */}
              <Section className="text-center mb-[24px]">
                <Img
                  src="https://placehold.co/56x56/1a1a1a/white?text=BA"
                  alt="Company Logo"
                  width="56"
                  height="56"
                  className="w-[56px] h-[56px] rounded-full mx-auto"
                />
              </Section>

              {/* Title */}
              <Heading className="text-[24px] sm:text-[32px] font-bold text-[#1a1a1a] text-center mb-[16px] mt-0 leading-[1.3]">
                Confirm your email
              </Heading>

              {/* Greeting */}
              <Text className="text-[16px] sm:text-[18px] text-[#1a1a1a] text-center mb-[12px] mt-0 leading-[1.5]">
                Hi {userName}! 👋
              </Text>

              {/* Description */}
              <Text className="text-[15px] sm:text-[16px] text-[#666666] text-center mb-[32px] mt-0 leading-[1.6] px-[8px]">
                You're almost there! We just need to confirm your email address
                to create your account.
              </Text>

              {/* CTA Button */}
              <Section className="text-center mb-[28px]">
                <Button
                  href={verificationLink}
                  className="bg-[#1a1a1a] text-white px-[32px] py-[14px] rounded-[28px] text-[16px] font-semibold no-underline inline-block"
                  style={{
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  Confirm Email
                </Button>
              </Section>

              {/* Alternative Link */}
              <Text className="text-[13px] text-[#999999] text-center mb-[24px] mt-0 leading-[1.5] px-[8px]">
                Or copy and paste this link into your browser:
              </Text>
              <Text className="text-[13px] text-[#1a1a1a] text-center mb-[32px] mt-0 leading-[1.5] break-all px-[8px]">
                {verificationLink}
              </Text>

              {/* Footer */}
              <Text className="text-[14px] sm:text-[15px] text-[#666666] text-center mt-[8px] mb-0 leading-[1.5]">
                See you there,
                <br />
                The {companyName}
              </Text>

              {/* Security Notice */}
              <Text className="text-[12px] sm:text-[13px] text-[#999999] text-center mt-[32px] mb-0 leading-[1.5] border-t border-[#e5e5e5] pt-[24px] px-[8px]">
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