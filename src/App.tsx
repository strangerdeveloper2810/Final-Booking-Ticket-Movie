import { type FC, type JSX } from "react";
import { HelmetProvider } from "react-helmet-async";
import AppRoutes from "./app/routes";
import { CustomThemeProvider } from "shared/theme/ThemeContext";
import ErrorBoundary from "shared/components/ErrorBoundary";
import "shared/i18n";

const App: FC = (): JSX.Element => {
  return (
    <HelmetProvider>
      <CustomThemeProvider>
        {/* Route-level boundary: isolate page crashes from theme/helmet context */}
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </CustomThemeProvider>
    </HelmetProvider>
  );
};

export default App;
