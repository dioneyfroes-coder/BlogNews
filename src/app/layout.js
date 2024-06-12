import { Inter } from "next/font/google";
import "../styles/globals.css";
import ClientLayout from "@/components/ClientLayout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blog News",
  description: "Um blog de notícias construído com Next.js",
  charset: "UTF-8",
  robots: "index, follow",
  author: "Dioney Froes Januario",
  keywords: "notícias, blog, tecnologia, atualidades",
  icons: {
    icon: { url: "/favicon.png", type: "image/png" },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <ErrorBoundary>
          <ClientLayout>
            {children}
          </ClientLayout>
          <ToastContainer />
        </ErrorBoundary>
      </body>
    </html>
  );
};
