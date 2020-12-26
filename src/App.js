import React from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useRoutes } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { ThemeProvider } from "@material-ui/core";

import { Reducer } from "./store";
import theme from "./theme";
import routes from "./routes";

const store = createStore(Reducer);

const App = () => {
  const routing = useRoutes(routes);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>{routing}</ThemeProvider>
    </Provider>
  );
};

export default App;
