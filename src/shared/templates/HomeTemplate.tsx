import { type FC, memo } from "react";
import Header from "shared/components/Header/Header";
import Footer from "shared/components/Footer/Footer";
import { ITemplate } from "shared/types/ITemplate";

const HomeTemplate: FC<ITemplate> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary transition-colors">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default memo(HomeTemplate);
