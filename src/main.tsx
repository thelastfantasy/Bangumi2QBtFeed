import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { FluentProvider, teamsDarkTheme, teamsLightTheme } from "@fluentui/react-components";
import { createRoot } from "react-dom/client";
import routes from "~react-pages";

import "./styles/index.scss";
import "./styles/App.scss";
import "@theme-toggles/react/css/InnerMoon.css";
import { useEffect } from "react";
import { RecoilRoot, useRecoilValue } from "recoil";
import { darkModeState } from "./store/theme";

// eslint-disable-next-line no-console
console.log(routes);

function RouteElement() {
  const element = useRoutes(routes);
  return element;
}

function Main() {
  return (
    <RecoilRoot>
      <MainInner></MainInner>
    </RecoilRoot>
  );
}

function MainInner() {
  const { systemTheme } = useRecoilValue(darkModeState);

  async function setupAppWindow() {
    const WebviewWindow = (await import("@tauri-apps/api/window")).WebviewWindow;
    const exit = (await import("@tauri-apps/api/process")).exit;

    const mainWindow = WebviewWindow.getByLabel("main");
    mainWindow?.show();

    // const infoWindow = WebviewWindow.getByLabel("info");
    // infoWindow?.show();

    mainWindow?.onCloseRequested(() => {
      exit();
    });
  }

  useEffect(() => {
    setupAppWindow();
  }, []);

  return (
    <FluentProvider theme={systemTheme === "dark" ? teamsDarkTheme : teamsLightTheme}>
      <Router>
        <div id="main">
          <RouteElement></RouteElement>
        </div>
      </Router>
    </FluentProvider>
  );
}

let container: HTMLElement | null = null;
document.addEventListener("DOMContentLoaded", function () {
  if (!container) {
    container = document.getElementById("root")!;
    const root = createRoot(container);
    root.render(<Main />);
  }
});
