import {configureStore, createReducer, createSlice} from "@reduxjs/toolkit";
import flagsSlice from "store/flagsSlice";

export const store = configureStore({
  reducer: {
    flags: flagsSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;