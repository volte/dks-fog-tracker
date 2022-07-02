import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "store/store";

interface State {
  enabledFlags: { [flag: string]: boolean };
}

const initialState: State = {
  enabledFlags: {}
};

const flagsSlice = createSlice({
  name: "flags",
  initialState,
  reducers: {
    setFlag: (state, action: PayloadAction<{ flag: string, value: boolean }>) => {
      if (action.payload.value) {
        state.enabledFlags[action.payload.flag] = true
      } else {
        delete state.enabledFlags[action.payload.flag];
      }
    }
  }
});

export const selectFlags = (state: RootState) => state.flags.enabledFlags;

export const {setFlag} = flagsSlice.actions;
export default flagsSlice.reducer;