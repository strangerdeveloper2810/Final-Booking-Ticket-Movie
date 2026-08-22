import { type FC } from "react";
import Header from "shared/components/Header/Header";
import Footer from "shared/components/Footer/Footer";
import { ITemplate } from "shared/types/ITemplate";

/**
 * EN: Page layout wrapper used by most routes (see `app/routes.tsx`) — renders the shared
 * `Header`/`Footer` chrome around whatever page content is passed as `children`.
 * VI: Wrapper bố cục trang được hầu hết các route dùng (xem `app/routes.tsx`) — hiển thị
 * `Header`/`Footer` dùng chung bao quanh nội dung trang được truyền vào qua `children`.
 * @param children - EN: the page-specific content to render between header and footer. VI: nội dung riêng của trang, hiển thị giữa header và footer.
 * @returns EN: the page layout JSX element. VI: phần tử JSX của bố cục trang.
 */
const HomeTemplate: FC<ITemplate> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary transition-colors">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default HomeTemplate;
