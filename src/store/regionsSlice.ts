import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, TrackerThunkArgument } from "store/store";
import { Tracker } from "tracker/Tracker";

export interface RegionState {
  id: string;
  name: string;
  areas: AreaState[];
  color?: string;
}

export interface AreaState {
  id: string;
  name: string;
  ports: PortState[];
}

export interface PortState {
  id: string;
  region: string;
  area: string;
  text: string;
  exitOnly: boolean;
  fromID?: string;
  toID?: string;
}

interface State {
  regions: RegionState[];
  ports: PortState[];
  filter: string;
}

const initialState: State = {
  regions: [],
  ports: [],
  filter: "",
};

const getRegionState = (regionID: string, tracker: Tracker) => {
  const getAreaState = (areaID: string) => {
    let areaInfo = tracker.layoutIndex.areas[areaID];
    let ports = areaInfo.ports || [];
    let result: AreaState = {
      id: areaID,
      name: areaInfo.name,
      ports: ports.map(getPortState),
    };
    return result;
  };

  const getPortState = (portID: string) => {
    let port = tracker.layoutIndex.ports[portID];
    let area = tracker.layoutIndex.areas[port.area];
    let region = tracker.layoutIndex.regions[area.region];
    return {
      id: port.id,
      text: port.text,
      area: area.name,
      region: region.name,
      toID: port.to,
      fromID: port.from,
      exitOnly: port.exitOnly,
    } as PortState;
  };

  let regionInfo = tracker.layoutIndex.regions[regionID];
  let areas = regionInfo.areas || [];
  let result: RegionState = {
    id: regionID,
    name: regionInfo.name,
    areas: areas.map(getAreaState),
    color: regionInfo.color,
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

  let ports: PortState[] = [];
  for (let region of regions) {
    for (let area of region.areas) {
      for (let port of area.ports) {
        ports.push(port);
      }
    }
  }

  context.dispatch(regionsSlice.actions.updateRegions(regions));
  context.dispatch(regionsSlice.actions.updatePorts(ports));
});

export const setConnection = createAsyncThunk<
  void,
  { from: string; to: string | null },
  TrackerThunkArgument
>("regions/setConnection", async ({ from, to }, context) => {
  const tracker = context.extra.tracker;
  tracker.makeConnection(from, to);
  context.dispatch(setFilter(""));
  context.dispatch(refreshRegions());
});

const regionsSlice = createSlice({
  name: "regions",
  initialState,
  reducers: {
    updateRegions: (state, action: PayloadAction<RegionState[]>) => {
      state.regions = action.payload;
    },
    updatePorts: (state, action: PayloadAction<PortState[]>) => {
      state.ports = action.payload;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
  },
});

export const selectFilter = (state: RootState) => state.regions.filter;
export const selectRegions = (state: RootState) => state.regions.regions;
export const selectPorts = (state: RootState) => state.regions.ports;

export const { setFilter } = regionsSlice.actions;

export default regionsSlice.reducer;
