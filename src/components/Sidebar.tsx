import { Flag, FlagGroup, GameLayout } from "tracker/GameLayout";
import { selectFlags, setFlag } from "store/flagsSlice";
import { useAppDispatch, useAppSelector } from "store/hooks";
import useBreakpoint, { lg, md } from "util/useBreakpoint";
import { useState } from "react";
import classNames from "classnames";

interface SidebarProps {
  layout: GameLayout;
}

interface SidebarState {
  collapse?: boolean;
}

export function Sidebar({ layout }: SidebarProps) {
  let [state, setState] = useState<SidebarState>({ collapse: true });

  const dispatch = useAppDispatch();
  const flags = useAppSelector(selectFlags);
  const breakpoint = useBreakpoint();

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

  const toggleCollapse = () => {
    setState({ collapse: !state.collapse });
  };

  let allowCollapse = breakpoint < md;
  let cls = classNames({
    sidebar: true,
    "sidebar--collapsed": allowCollapse && state.collapse,
  });

  return (
    <div className={cls}>
      {allowCollapse && (
        <button onClick={toggleCollapse}>
          <i className="fa-solid fa-bars" />
        </button>
      )}
      {(!allowCollapse || !state.collapse) && (
        <>
          <div className="flagGroups">
            {layout.flagGroups.map(renderFlagGroup)}
          </div>
        </>
      )}
    </div>
  );
}
