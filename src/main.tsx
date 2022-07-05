import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "components/App";
import { Tracker } from "tracker/Tracker";
import { Provider } from "react-redux";
import { createStore } from "store/store";
import { refreshRegions } from "store/regionsSlice";
import { loadGameLayout } from "tracker/GameLayoutDefinition";

// @ts-ignore
import darkSoulsLayoutData from "tracker/layouts/darksouls.yaml";

import "./reset.css";
import "./index.scss";

import "@fortawesome/fontawesome-free/css/fontawesome.css";
import "@fortawesome/fontawesome-free/css/solid.css";

let gameLayout = loadGameLayout(darkSoulsLayoutData);
let tracker = new Tracker(gameLayout);
let store = createStore(tracker);

tracker.load();
store.dispatch(refreshRegions());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App layout={tracker.layout} />
    </Provider>
  </React.StrictMode>
);
