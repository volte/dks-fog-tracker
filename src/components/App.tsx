import { useState } from "react";
import { Tracker } from "tracker/Tracker";
import { Flag, FlagGroup, GameLayout } from "tracker/GameLayout";
import { useDispatch, useSelector } from "react-redux";
import flagsSlice, { selectFlags, setFlag } from "store/flagsSlice";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { PortState, RegionState, selectRegions } from "store/regionsSlice";

interface AppProps {
  layout: GameLayout;
}

function App({ layout }: AppProps) {
  const dispatch = useAppDispatch();
  const flags = useAppSelector(selectFlags);
  const regions = useAppSelector(selectRegions);

  const sidebar = () => (
    <div className="sidebar">
      <h1>Flags</h1>
      <div className="flagGroups">{layout.flagGroups.map(renderFlagGroup)}</div>
    </div>
  );

  const renderFlag = (flag: Flag) => (
    <>
      <input
        type="checkbox"
        id={`flag_${flag.id}`}
        checked={flags[flag.id] !== undefined}
        onChange={(e) =>
          dispatch(setFlag({ flag: flag.id, value: e.target.checked }))
        }
      />
      <label htmlFor={`flag_${flag.id}`}>{flag.name}</label>
    </>
  );

  const renderFlagGroup = (group: FlagGroup) => (
    <div key={group.name} className="flagGroup">
      <h2>{group.name}</h2>
      <ul>
        {group.flags.map((flag) => (
          <li key={flag.id}>{renderFlag(flag)}</li>
        ))}
      </ul>
    </div>
  );

  const renderPort = (port: PortState) => (
    <div key={port.id} className="portInfo">
      <div className="label">{port.text}</div>
      {port.destID ? (
        <div className="port connected">{port.destLabel}</div>
      ) : (
        <div className="port disconnected">???</div>
      )}
    </div>
  );

  const renderRegion = (region: RegionState, depth: number) => (
    <div key={region.id} className="regionInfo">
      <div className="name">{region.name}</div>
      {region.subRegions && renderRegionList(region.subRegions, depth + 1)}
      {region.ports && region.ports.map((p) => renderPort(p))}
    </div>
  );

  const renderRegionList = (regions: RegionState[], depth: number) => (
    <div className="regionList" style={{ paddingLeft: depth * 4 }}>
      {regions.map((r) => renderRegion(r, depth))}
    </div>
  );

  return (
    <div className="appRoot">
      {sidebar()}
      {renderRegionList(regions, 0)}
    </div>
  );
}

export default App;
