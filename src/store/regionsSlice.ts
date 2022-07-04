import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ThunkAction,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import { RootState, TrackerThunkArgument } from "store/store";
import _ from "lodash";
import { PortInfo, Tracker } from "tracker/Tracker";
import { Port, Area } from "tracker/GameLayout";

export interface RegionState {
  id: string;
  name: string;
  ports: PortState[];
  subRegions: RegionState[];
}

export interface PortState {
  id: string;
  text: string;
  destID?: string;
  destLabel?: string;
}

interface State {
  regions: RegionState[];
}

const initialState: State = {
  regions: [],
};

const getRegionState = (regionID: string, tracker: Tracker) => {
  const getPortState = (port: PortInfo) => {
    let portDest = tracker.layoutIndex.connections[port.id];
    let result: PortState = {
      id: port.id,
      text: port.text,
    } as PortState;
    if (portDest) {
      result.destID = portDest;
      let dstPortInfo = tracker.layoutIndex.ports[portDest];
      if (dstPortInfo) {
        result.destLabel = dstPortInfo.text;
      }
    }
    return result;
  };

  let regionInfo = tracker.layoutIndex.regions[regionID];
  let ports = regionInfo.ports || [];
  let subRegions = regionInfo.children || [];
  let result: RegionState = {
    id: regionID,
    name: regionInfo.name,
    ports: ports.map((pi) => getPortState(pi)),
    subRegions: subRegions.map((r) => getRegionState(r, tracker)),
  };

  return result;
};

export const refreshRegions = createAsyncThunk<
  void,
  void,
  TrackerThunkArgument
>("regions/refreshRegions", async (_, context) => {
  const tracker = context.extra.tracker;
  let regions = tracker.layout.regions.map((r) =>
    getRegionState(r.id, tracker)
  );
  context.dispatch(regionsSlice.actions.updateRegions(regions));
});

export const setConnection = createAsyncThunk<
  void,
  { from: string; to: string | null },
  TrackerThunkArgument
>("regions/setConnection", async ({ from, to }, context) => {
  const tracker = context.extra.tracker;
  tracker.makeConnection(from, to);
  context.dispatch(refreshRegions());
});

const regionsSlice = createSlice({
  name: "regions",
  initialState,
  reducers: {
    updateRegions: (state, action: PayloadAction<RegionState[]>) => {
      state.regions = action.payload;
    },
  },
});

export const selectRegions = (state: RootState) => state.regions.regions;

export default regionsSlice.reducer;
