import React from "react";
import ReactDOM from "react-dom/client";
import App from "components/App";
import {Tracker} from "tracker/Tracker";
import {darkSoulsGameLayout} from "tracker/GameLayouts/DarkSouls";
import {Provider} from "react-redux";
import {store} from "store/store";

import "./index.scss";

let tracker = new Tracker(darkSoulsGameLayout);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App layout={tracker.layout}/>
    </Provider>
  </React.StrictMode>
);