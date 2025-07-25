import { ReactNode } from 'react';
import { Roboto } from 'next/font/google';
import '../styles/globals.css';
import ClientLayout from "@/components/ClientLayout";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

export const metadata = {
  title: "BlogNews",
  description: "Um blog moderno construído com Next.js e Material-UI",
  charset: "UTF-8",
  robots: "index, follow",
  author: "Dioney Froes Januario",
  keywords: "aplicação web, blog, tecnologia, programação",
  icons: {
    icon: { url: "/favicon.png", type: "image/png" },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-br">
      <body className={roboto.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
};
