import { configureStore } from "@reduxjs/toolkit";
import flagsSlice from "store/flagsSlice";
import regionsSlice, { refreshRegions } from "store/regionsSlice";
import { Tracker } from "tracker/Tracker";

export function createStore(tracker: Tracker) {
  let store = configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: { tracker } },
      }),
    reducer: {
      flags: flagsSlice,
      regions: regionsSlice,
    },
  });

  tracker.events$.subscribe((evt) => {
    switch (evt.type) {
      case "layoutIndexRebuilt":
        store.dispatch(refreshRegions());
    }
  });

  return store;
}

export type TrackerThunkArgument = { extra: { tracker: Tracker } };
export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];
