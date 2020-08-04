import React from "react";
import ReactDOM from "react-dom";

import AnyComponent from "./AnyComponent.jsx";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <AnyComponent />
  </React.StrictMode>,
  rootElement
);
