import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme/ThemeContext";
import { ClientThemeProvider } from "@/lib/theme/ClientThemeProvider";
import { AccessibilityProvider } from "@/components/ui";

export const metadata: Metadata = {
  title: "Weave Component Library",
  description: "Linear.app 다크 테마 기반의 재사용 가능한 컴포넌트 시스템",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="antialiased font-primary">
        <AccessibilityProvider>
          <ClientThemeProvider>
            {children}
          </ClientThemeProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
