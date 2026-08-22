import React from "react";
import { ConfigProvider, theme } from "antd";
import AppRoutes from "./app/routes";
import { tokens } from "shared/theme/tokens";

const App: React.FC = (): React.JSX.Element => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: tokens.primary,
          colorBgBase: tokens.background,
          colorBgContainer: tokens.surface,
          colorBorder: tokens.border,
          colorText: tokens.textPrimary,
          colorTextDescription: tokens.textSecondary,
          borderRadius: tokens.borderRadiusButton,
        },
      }}
    >
      <AppRoutes />
    </ConfigProvider>
  );
};

export default App;
