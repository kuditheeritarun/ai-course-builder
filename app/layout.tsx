import type { Metadata } from "next";
import { ClerkProvider, GoogleOneTap } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Course Builder",
  description: "Create personalized learning paths with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${poppins.className} text-base`}>
          <GoogleOneTap />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}