import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TalentBoard AI - Your Intelligent Career Operating System",
  description:
    "Track applications, showcase projects, optimize resumes, prepare for interviews, and receive AI-powered career insights — all from one intelligent platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${interTight.variable} h-full`}
    >
      <Script id="suppress-extension-runtime-errors" strategy="beforeInteractive">
        {`
          (() => {
            const extensionErrorPatterns = [
              "MetaMask",
              "Failed to connect to MetaMask",
              "MetaMask extension not found",
              "chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn"
            ];

            const isExtensionNoise = (value) => {
              const text = String(
                value?.message ||
                value?.reason?.message ||
                value?.stack ||
                value?.reason ||
                value ||
                ""
              );

              return extensionErrorPatterns.some((pattern) => text.includes(pattern));
            };

            window.addEventListener(
              "error",
              (event) => {
                if (isExtensionNoise(event.error) || isExtensionNoise(event.message) || isExtensionNoise(event.filename)) {
                  event.preventDefault();
                  event.stopImmediatePropagation();
                }
              },
              true
            );

            window.addEventListener(
              "unhandledrejection",
              (event) => {
                if (isExtensionNoise(event.reason)) {
                  event.preventDefault();
                  event.stopImmediatePropagation();
                }
              },
              true
            );
          })();
        `}
      </Script>
      <body className="min-h-full flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
