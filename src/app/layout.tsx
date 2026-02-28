import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/providers/ThemeContext';
import { AuthProvider } from '@/components/providers/AuthProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TA-Direct Portal",
  description: "Secure, premium communication portal for University Teaching Assistants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased mesh-bg bg-black min-h-screen text-white selection:bg-white/30 transition-colors duration-700`}
      >
        <ThemeProvider>
          <AuthProvider>
            {/* Aesthetic Texture Filter */}
            <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <main className="relative z-0 flex min-h-screen flex-col items-center p-6 md:p-12 lg:p-24 overflow-x-hidden">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
