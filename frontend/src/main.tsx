import React from "react";
import ReactDOM from "react-dom/client";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { appTheme } from "./theme/theme";
import App from "./app/App";
import { AppProviders } from "./app/providers";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <MantineProvider theme={appTheme} defaultColorScheme="light">
      <AppProviders>
        <App />
      </AppProviders>
    </MantineProvider>
  </React.StrictMode>
);