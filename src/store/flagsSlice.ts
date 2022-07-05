import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, TrackerThunkArgument } from "store/store";
import _ from "lodash";
import { PortState, refreshRegions } from "store/regionsSlice";

type FlagSet = { [flag: string]: boolean };

interface State {
  enabledFlags: FlagSet;
}

const initialState: State = {
  enabledFlags: {},
};

function toFlagSet(flags: string[]) {
  return _.chain(flags)
    .keyBy((flag) => flag)
    .mapValues(() => true)
    .value();
}

export const setFlag = createAsyncThunk<
  void,
  { flag: string; value: boolean },
  TrackerThunkArgument
>("flags/setFlag", async ({ flag, value }, context) => {
  const tracker = context.extra.tracker;
  tracker.setFlag(flag, value);
});

export const refreshFlags = createAsyncThunk<void, void, TrackerThunkArgument>(
  "flags/refreshFlags",
  async (x, context) => {
    const tracker = context.extra.tracker;
    let flags = tracker.flags;

    context.dispatch(
      flagsSlice.actions.updateFlags(
        _.chain(flags)
          .keyBy()
          .mapValues((x) => true)
          .value()
      )
    );
  }
);

const flagsSlice = createSlice({
  name: "flags",
  initialState,
  reducers: {
    updateFlags: (state, action: PayloadAction<FlagSet>) => {
      state.enabledFlags = action.payload;
    },
  },
});

export const selectFlags = (state: RootState) => state.flags.enabledFlags;

export default flagsSlice.reducer;
