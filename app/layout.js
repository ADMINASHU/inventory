import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { auth } from "@/auth";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Techser Inventory App",
  description: "Techser Inventory Management App",
  links: [
    { rel: "preload", href: "/_next/static/css/app/layout.css", as: "style" },
  ],
};

export default async function RootLayout({ children }) {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const loggedUser = session?.user;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} text-sm flex flex-col min-h-screen overflow-x-hidden`}
      >
        <Navbar isAuthenticated={isAuthenticated} session={session} loggedUser={loggedUser} />
        <main className="flex-1 w-full">{children}</main>
        <Footer isAuthenticated={isAuthenticated} loggedUser={loggedUser} />
      </body>
    </html>
  );
}
