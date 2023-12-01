import type { Metadata } from "next";
import "./globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../components/cotexts/AuthContext";

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
      <html lang="en">
        <body>
          <Navbar />
          <main className="relative overflow-hidden">{children}</main>
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}
