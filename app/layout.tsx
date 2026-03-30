import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TaskProvider } from "./context/TaskContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Student Task Reminder System",
  description: "A pixel-perfect task management frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <TaskProvider>
          {children}
        </TaskProvider>
      </body>
    </html>
  );
}
