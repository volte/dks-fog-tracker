import React from "react";
import ReactDOM from "react-dom/client";
import App from "components/App";
import { Tracker } from "tracker/Tracker";
import { darkSoulsGameLayout } from "tracker/GameLayouts/DarkSouls";
import { Provider } from "react-redux";
import { createStore } from "store/store";
import { refreshRegions } from "store/regionsSlice";

import "./reset.css";
import "./index.scss";

let tracker = new Tracker(darkSoulsGameLayout);
let store = createStore(tracker);

store.dispatch(refreshRegions());

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App layout={tracker.layout} />
    </Provider>
  </React.StrictMode>
);
