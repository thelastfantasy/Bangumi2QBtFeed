import { Suspense } from "react";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { FluentProvider, teamsDarkTheme } from "@fluentui/react-components";
import ReactDOM from "react-dom";

import "./styles/index.scss";
import "./styles/App.scss";

import routes from "~react-pages";

// eslint-disable-next-line no-console
console.log(routes);

function App() {
  const element = useRoutes(routes);
  return element;
}

ReactDOM.render(
  <Router>
    <FluentProvider theme={teamsDarkTheme}>
      <App />
    </FluentProvider>
  </Router>,
  document.getElementById("root")
);
