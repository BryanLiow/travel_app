import type { Metadata } from "next";
import "./globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../components/contexts/AuthContext";
import { PostProvider } from "../components/contexts/PostContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const metadata: Metadata = {
  title: "Travel",
  description: "Travel App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <PostProvider>
        <html lang="en">
          <body>
            <Navbar />
            <main className="relative overflow-hidden">{children}</main>
            <Footer />
          </body>
        </html>
      </PostProvider>
    </AuthProvider>
  );
}
