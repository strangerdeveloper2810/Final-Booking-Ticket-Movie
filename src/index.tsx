import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// Reset CSS from Antdesign
import "antd/dist/reset.css";
// CSS for project
import "assets/scss/style.scss";
// React Router Dom
import { unstable_HistoryRouter as HistoryBrowser } from "react-router-dom";
// import slick carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// Set up Redux Toolkit
import { Provider } from "react-redux";
import { store } from "Redux/store";
import { history } from "util/setting";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HistoryBrowser history={history}>
        <App />
      </HistoryBrowser>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
