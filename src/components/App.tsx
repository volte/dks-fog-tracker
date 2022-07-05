import { GameLayout } from "tracker/GameLayout";
import { Sidebar } from "components/Sidebar";
import { AreaList } from "components/AreaList";
import { useEffect, useState } from "react";
import { Filter } from "components/Filter";
import { useDispatch, useStore } from "react-redux";
import { useAppSelector } from "store/hooks";
import { selectFilter, setFilter } from "store/regionsSlice";

interface AppProps {
  layout: GameLayout;
}

function App({ layout }: AppProps) {
  let filter = useAppSelector(selectFilter);
  let dispatch = useDispatch();

  return (
    <div className="appRoot">
      <Sidebar layout={layout} />
      <div className="mainPane">
        <div className="filterBar">
          <Filter
            value={filter}
            onChange={(newValue) => dispatch(setFilter(newValue))}
          />
        </div>
        <div className="areaListContainer">
          <AreaList layout={layout} filter={filter} />
        </div>
      </div>
    </div>
  );
}

export default App;
