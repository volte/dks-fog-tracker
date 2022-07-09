import { createAsyncThunk } from "@reduxjs/toolkit";
import { TrackerThunkArgument } from "store/store";
import FileSaver from "file-saver";

export const exportData = createAsyncThunk<void, void, TrackerThunkArgument>(
  "data/exportData",
  async (x, context) => {
    const tracker = context.extra.tracker;
    let data = tracker.getData();
    let blob = new Blob([data]);
    FileSaver.saveAs(blob, "gameState.json");
  }
);
