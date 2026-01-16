<div align="center">
  <h1>🔐 Better Auth Starter</h1>
  <p><strong>A modern, secure, and feature-rich authentication system</strong></p>
  
  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
  ![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
  ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)
  
  <p>Built with Next.js 16 and BetterAuth for production-ready authentication</p>
  
  [Features](#-features) •
  [Demo](#-demo) •
  [Installation](#-installation) •
  [Documentation](#-documentation) •
  [Contributing](#-contributing)
</div>

---

## ✨ Features

<table>
  <tr>
    <td>
      <h3>🔑 Authentication</h3>
      <ul>
        <li>Email/Password signup & login</li>
        <li>OAuth (GitHub & Google)</li>
        <li>Email verification</li>
        <li>Passwordless authentication</li>
      </ul>
    </td>
    <td>
      <h3>🛡️ Security</h3>
      <ul>
        <li>TOTP-based Two-Factor Authentication</li>
        <li>Backup codes for 2FA</li>
        <li>Secure session management</li>
        <li>Password strength validation</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <h3>👤 Account Management</h3>
      <ul>
        <li>Profile updates</li>
        <li>Password change & reset</li>
        <li>Account linking (multiple providers)</li>
        <li>Account deletion</li>
      </ul>
    </td>
    <td>
      <h3>📧 Email System</h3>
      <ul>
        <li>Email verification</li>
        <li>Password reset emails</li>
        <li>Transactional notifications</li>
        <li>Custom email templates</li>
      </ul>
    </td>
  </tr>
</table>

## 🎯 Demo

> 🚀 **[Live Demo](https://your-demo-url.com)**

### Screenshots

<details>
<summary>Click to expand screenshots</summary>

#### Login & Signup

![Login Page](https://via.placeholder.com/800x400?text=Login+Page)
![Signup Page](https://via.placeholder.com/800x400?text=Signup+Page)

#### Two-Factor Authentication

![2FA Setup](https://via.placeholder.com/800x400?text=2FA+Setup)

#### User Dashboard

![Dashboard](https://via.placeholder.com/800x400?text=Dashboard)

</details>

## 🛠️ Tech Stack

### Frontend

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Backend & Database

![Better Auth](https://img.shields.io/badge/Better_Auth-4B32C3?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)

### Authentication & OAuth

![GitHub](https://img.shields.io/badge/GitHub_OAuth-181717?style=for-the-badge&logo=github&logoColor=white)
![Google](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)

### Tools & Libraries

![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=resend&logoColor=white)
![Sonner](https://img.shields.io/badge/Sonner-F59E0B?style=for-the-badge)
![PNPM](https://img.shields.io/badge/PNPM-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ or **Bun**
- **PNPM** package manager
- **PostgreSQL** database (local or cloud)
- **GitHub OAuth App** (for GitHub login)
- **Google OAuth App** (for Google login)
- **Resend Account** (for emails)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/better-auth.git
   cd better-auth
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/better_auth"

   # Auth Configuration
   AUTH_SECRET="your-secret-key-min-32-chars"
   BETTER_AUTH_URL="http://localhost:3000"

   # GitHub OAuth
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"

   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Resend (Email Service)
   RESEND_API_KEY="your-resend-api-key"
   ```

4. **Run database migrations**

   ```bash
   pnpm drizzle:migrate
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
better-auth/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (authentication)/     # Auth route group
│   │   │   ├── auth/            # Auth pages
│   │   │   │   ├── login/       # Login page
│   │   │   │   ├── signup/      # Signup page
│   │   │   │   ├── verify-email/ # Email verification
│   │   │   │   ├── reset-password/ # Password reset
│   │   │   │   └── 2fa/         # Two-factor auth setup
│   │   │   └── profile/         # User profile & settings
│   │   ├── dashboard/           # Main dashboard
│   │   ├── api/                 # API routes
│   │   │   ├── auth/           # BetterAuth API
│   │   │   └── check-availability/ # Username check
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   │
│   ├── components/              # React components
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── auth-forms/         # Authentication forms
│   │   │   ├── login-form.tsx
│   │   │   ├── signup-form.tsx
│   │   │   └── ...
│   │   └── providers/          # Context providers
│   │
│   ├── lib/                     # Utility functions
│   │   ├── auth.ts             # BetterAuth server config
│   │   ├── auth-client.ts      # BetterAuth client config
│   │   ├── db.ts               # Database client
│   │   ├── utils.ts            # Helper functions
│   │   └── o-auth-providers.ts # OAuth configuration
│   │
│   ├── db/                      # Database
│   │   ├── schema.ts           # Drizzle schema
│   │   └── migrations/         # Database migrations
│   │
│   ├── emails/                  # Email templates
│   │   ├── verification-email.tsx
│   │   └── reset-password-email.tsx
│   │
│   └── types/                   # TypeScript types
│
├── public/                      # Static assets
├── drizzle.config.ts           # Drizzle configuration
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## 🔐 Authentication Flow

### Email/Password Authentication

```mermaid
graph LR
    A[User Signup] --> B[Email Verification Sent]
    B --> C[User Clicks Verification Link]
    C --> D[Account Activated]
    D --> E[User Can Login]
    E --> F{2FA Enabled?}
    F -->|Yes| G[Enter TOTP Code]
    F -->|No| H[Access Dashboard]
    G --> H
```

### OAuth Flow

```mermaid
graph LR
    A[Click OAuth Button] --> B[Redirect to Provider]
    B --> C[User Authorizes]
    C --> D[Callback to App]
    D --> E{Account Exists?}
    E -->|Yes| F[Login User]
    E -->|No| G[Create Account]
    G --> F
    F --> H[Access Dashboard]
```

## 🚀 Usage

### Basic Authentication

```typescript
// Login with email/password
import { authClient } from "@/lib/auth-client";

const handleLogin = async (email: string, password: string) => {
  await authClient.signIn.email(
    {
      email,
      password,
    },
    {
      onSuccess: () => {
        router.push("/dashboard");
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );
};
```

### OAuth Authentication

```typescript
// Login with OAuth provider
const handleOAuthLogin = async (provider: "github" | "google") => {
  await authClient.signIn.social({
    provider,
  });
};
```

### Two-Factor Authentication

```typescript
// Enable 2FA
const enable2FA = async () => {
  const response = await authClient.twoFactor.enable({
    password: userPassword,
  });

  // Display QR code using response.totpURI
  setQRCodeURI(response.totpURI);
};
```

### Session Management

```typescript
// Get current session
const { data: session } = authClient.useSession();

// Sign out
const handleSignOut = async () => {
  await authClient.signOut();
  router.push("/auth/login");
};
```

## 📝 API Routes

| Endpoint                  | Method  | Description                 |
| ------------------------- | ------- | --------------------------- |
| `/api/auth/*`             | Various | BetterAuth endpoints        |
| `/api/check-availability` | GET     | Check username availability |

## 🔧 Configuration

### OAuth Setup

<details>
<summary><b>GitHub OAuth</b></summary>

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env.local`

</details>

<details>
<summary><b>Google OAuth</b></summary>

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

</details>

<details>
<summary><b>Resend Email</b></summary>

1. Sign up at [Resend](https://resend.com/)
2. Verify your domain
3. Create an API key
4. Add to `.env.local`

</details>

## 🎨 Customization

### Styling

The project uses Tailwind CSS with custom components. Modify the theme in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Email Templates

Email templates are located in `src/emails/`. Customize them using React:

```tsx
// src/emails/verification-email.tsx
export const VerificationEmail = ({ verificationUrl }: Props) => {
  return <div>{/* Your custom email template */}</div>;
};
```

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm test:e2e

# Run tests in watch mode
pnpm test:watch
```

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: Optimized with Next.js 16 and Turbopack

## 🛡️ Security Features

- ✅ Password hashing with bcrypt
- ✅ CSRF protection
- ✅ Rate limiting on auth endpoints
- ✅ Secure session management
- ✅ Email verification required
- ✅ Optional 2FA with TOTP
- ✅ Secure password reset flow

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/better-auth)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [BetterAuth](https://better-auth.com/) - Modern authentication library
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Resend](https://resend.com/) - Email for developers
- [shadcn/ui](https://ui.shadcn.com/) - Re-usable components

## 📞 Support

- 📧 Email: yousaf.dev18@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/Yosf96633/Better_auth_starter/issues)

## 🗺️ Roadmap

- [ ] Magic link authentication
- [ ] Social login (Twitter, LinkedIn)
- [ ] Organization, Passkey and Admin Plugins
- [ ] Account activity logs
- [ ] Advanced session management
- [ ] Passwordless authentication improvements
- [ ] Dark mode support

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/yourusername">Your Name</a></p>
  
  <p>
    <a href="https://github.com/Yosf96633/Better_auth_starter">⭐ Star this repo</a> •
    <a href="www.linkedin.com/in/yousaf-dev18">💼 Connect on LinkedIn</a>
  </p>
  
  ![GitHub stars](https://img.shields.io/github/stars/yourusername/better-auth?style=social)
  ![GitHub forks](https://img.shields.io/github/forks/yourusername/better-auth?style=social)
  ![GitHub watchers](https://img.shields.io/github/watchers/yourusername/better-auth?style=social)
</div>
