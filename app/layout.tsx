import type { Metadata } from "next";
import "./globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
// import AuthPortal from "../components/AuthPortal";

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
    <html lang="en">
      <body>
        <Navbar />
        <main className="relative overflow-hidden">
          {/* <AuthPortal /> */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
