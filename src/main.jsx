import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./redux/store";
// Bootstrap CSS
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
// import "bootstrap/dist/js/bootstrap.bundle.min";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <Provider store={store}>
    <ConfigProvider locale={viVN}>
      <App />
    </ConfigProvider>
  </Provider>
  // </React.StrictMode>
);
