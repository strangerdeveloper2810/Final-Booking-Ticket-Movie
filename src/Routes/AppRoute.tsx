import { FC, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { LoadingNew } from "Components";
import { map } from "lodash";
import routes from "constants/initialRoute";
import { ErrorTemplate } from "Template";
import { ToastContainer } from "react-toastify";

const AppRoutes: FC = () => {
  const renderRoute = () =>
    map(routes, ({ path, Component, Layout }) => (
      <Route
        key={path}
        path={path}
        element={
          <Layout>
            <Component />
          </Layout>
        }
      />
    ));
  return (
    <Suspense fallback={<LoadingNew />}>
      <ToastContainer />
      <div className="w-screen">
        <Routes>
          {renderRoute()}
          <Route path="*" element={<ErrorTemplate />} />
        </Routes>
      </div>
    </Suspense>
  );
};

export default AppRoutes;
