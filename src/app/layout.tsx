import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";


export const metadata: Metadata = {
  title: "GameHub - Play Games Online",
  description:
    "Play Tic-Tac-Toe, Rock-Paper-Scissors and more games online with friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
