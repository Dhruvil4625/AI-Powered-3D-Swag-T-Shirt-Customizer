import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI 3D Swag Customizer",
  description: "Design your unique and exclusive T-shirt with AI-powered 3D customization. Generate logos with DALL·E, pick colors, upload artwork, and download your creation.",
  keywords: ["3D", "T-shirt", "customizer", "AI", "DALL-E", "Three.js"],
  openGraph: {
    title: "AI 3D Swag Customizer",
    description: "Design your unique 3D T-shirt powered by AI",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
