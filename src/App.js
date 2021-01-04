import React from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useRoutes } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { ThemeProvider } from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns"; // choose your lib
import { MuiPickersUtilsProvider } from "@material-ui/pickers";

import { Reducer } from "./store";
import theme from "./theme";
import routes from "./routes";

const store = createStore(Reducer);

const App = () => {
  const routing = useRoutes(routes);

  return (
    <Provider store={store}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <ThemeProvider theme={theme}>{routing}</ThemeProvider>
      </MuiPickersUtilsProvider>
    </Provider>
  );
};

export default App;
