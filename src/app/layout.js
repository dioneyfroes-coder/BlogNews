import { Inter } from "next/font/google";
import ClientLayout from "@/components/ClientLayout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blog News",
  description: "Um blog de notícias construído com Next.js",
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
}
