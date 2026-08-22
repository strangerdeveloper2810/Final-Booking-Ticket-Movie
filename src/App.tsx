import { type FC, type JSX } from "react";
import { HelmetProvider } from "react-helmet-async";
import AppRoutes from "./app/routes";
import { CustomThemeProvider } from "shared/theme/ThemeContext";
import "shared/i18n";

const App: FC = (): JSX.Element => {
  return (
    <HelmetProvider>
      <CustomThemeProvider>
        <AppRoutes />
      </CustomThemeProvider>
    </HelmetProvider>
  );
};

export default App;
