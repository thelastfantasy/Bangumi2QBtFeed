import { Suspense } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { FluentProvider, teamsDarkTheme } from "@fluentui/react-components";
import ReactDOM from "react-dom";

import "./styles/index.scss";
import "./styles/App.scss";

import routes from "~react-pages";
import { useDarkMode } from "./hooks";

// eslint-disable-next-line no-console
console.log(routes);

function RouteElement() {
  const element = useRoutes(routes);
  return element;
}

function Main() {
  const { theme } = useDarkMode();

  return (
    <Router>
      <FluentProvider theme={theme}>
        <div id="main">
          <RouteElement></RouteElement>
        </div>
      </FluentProvider>
    </Router>
  );
}

ReactDOM.render(<Main />, document.getElementById("root"));
