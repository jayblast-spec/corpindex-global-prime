import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Ticker from "@/components/home/Ticker";

interface LayoutProps {
  children: ReactNode;
  showTicker?: boolean;
}

const Layout = ({ children, showTicker = true }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      {showTicker && <Ticker />}
      <main className={`flex-1 ${showTicker ? "pt-28" : "pt-16"}`}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
