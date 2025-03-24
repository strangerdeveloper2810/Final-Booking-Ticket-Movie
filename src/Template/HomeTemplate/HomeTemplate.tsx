import { memo, FC } from "react";
import { Footer, Header } from "Components";
import { ITemplate } from "types/ITemplate";

const HomeTemplate: FC<ITemplate> = ({ children }) => {
  return (
    <div className="container">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default memo(HomeTemplate);
