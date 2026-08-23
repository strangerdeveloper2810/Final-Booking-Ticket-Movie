import { type FC, ReactNode } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

interface HomeTemplateProps {
  children: ReactNode;
}

const HomeTemplate: FC<HomeTemplateProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary transition-colors duration-300">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default HomeTemplate;
