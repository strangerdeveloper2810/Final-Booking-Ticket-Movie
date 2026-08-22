import { type FC, type JSX } from "react";
import { App as AntdApp } from "antd";
import { HelmetProvider } from "react-helmet-async";
import AppRoutes from "./app/routes";
import { CustomThemeProvider } from "shared/theme/ThemeContext";
import ErrorBoundary from "shared/components/ErrorBoundary";
import "shared/i18n";

const App: FC = (): JSX.Element => {
  return (
    <HelmetProvider>
      <CustomThemeProvider>
        {/*
          antd's <App> component must sit inside ConfigProvider (which
          CustomThemeProvider renders) — it's what lets Modal.useModal() /
          message.useMessage() / notification.useNotification() actually
          consume the dynamic dark/light theme algorithm and tokens. The
          static Modal.confirm()/message.success() functions do NOT read
          this context at all (a documented antd v5 limitation), so any
          screen that needs a confirm/warning dialog must pull it from
          App.useApp() instead — see BookingTicket.tsx for the pattern.
        */}
        <AntdApp>
          {/* Route-level boundary: isolate page crashes from theme/helmet context */}
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </AntdApp>
      </CustomThemeProvider>
    </HelmetProvider>
  );
};

export default App;
