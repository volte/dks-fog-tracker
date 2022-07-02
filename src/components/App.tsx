import {useState} from "react";
import {Tracker} from "tracker/Tracker";
import {Flag, FlagGroup, GameLayout} from "tracker/GameLayout";
import {useDispatch, useSelector} from "react-redux";
import flagsSlice, {selectFlags, setFlag} from "store/flagsSlice";
import {useAppDispatch, useAppSelector} from "store/hooks";

interface AppProps {
  layout: GameLayout
}

function App({layout}: AppProps) {
  const dispatch = useAppDispatch();
  const flags = useAppSelector(selectFlags);

  const renderFlag = (flag: Flag) => <>
    <input
      type="checkbox"
      id={`flag_${flag.id}`}
      checked={flags[flag.id] !== undefined}
      onChange={e => dispatch(setFlag({ flag: flag.id, value: e.target.checked }))}
    />
    <label htmlFor={`flag_${flag.id}`}>{flag.name}</label>
  </>


  const renderFlagGroup = (group: FlagGroup) =>
    <div key={group.name} className="flagGroup">
      <h2>{group.name}</h2>
      <ul>
        {group.flags.map(flag =>
        <li key={flag.id}>{renderFlag(flag)}</li>
        )}
      </ul>
    </div>;

  return (
    <div className="App">
      {layout.flagGroups.map(renderFlagGroup)}
    </div>
  );
}

export default App;
