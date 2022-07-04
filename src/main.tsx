import React from "react";
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

let gameLayout = loadGameLayout(darkSoulsLayoutData);
let tracker = new Tracker(gameLayout);
let store = createStore(tracker);

store.dispatch(refreshRegions());

console.log(gameLayout);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App layout={tracker.layout} />
    </Provider>
  </React.StrictMode>
);
