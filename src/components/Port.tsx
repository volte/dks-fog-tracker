import {
  PortState,
  selectPorts,
  selectRegions,
  setConnection,
} from "store/regionsSlice";
import { useState } from "react";
import Select, {
  components,
  OptionProps,
  SingleValueProps,
  SingleValue,
  MultiValue,
  ActionMeta,
} from "react-select";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { FilterOptionOption } from "react-select/dist/declarations/src/filters";
import _, { isArray } from "lodash";
import classNames from "classnames";

interface PortInfo {
  id: string;
  areaName: string;
  name: string;
  connected: boolean;
}

interface PortProps {
  port: PortState;
}

interface PortOptionProps {
  id: string;
  region: string;
  area: string;
  text: string;
  focused: boolean;
  selected: boolean;
  connected: boolean;
}

const PortOptionComponent = ({
  id,
  region,
  area,
  text,
  focused,
  selected,
  connected,
}: PortOptionProps) => {
  const label = `${region} / ${area} / ${text}`;
  const cls = classNames({
    portOption: true,
    "portOption--connected": connected,
    "portOption--selected": selected,
  });

  return (
    <div className={cls}>
      <div className="portOption__id">{id}</div>
      <div className="portOption__info">
        <div className="portOption__text">{label}</div>
      </div>
    </div>
  );
};

type PortOption = { label: string; value: string };

export function Port({ port }: PortProps) {
  const dispatch = useAppDispatch();
  const ports = useAppSelector(selectPorts);
  let options = ports.map((port) => ({
    label: port.text,
    value: port.id,
  }));
  let selectedOption: SingleValue<PortOption> = port.toID
    ? {
        label: "",
        value: port.toID,
      }
    : null;
  let portIndex = _.keyBy(ports, (p) => p.id);

  const Option = (props: OptionProps<PortOption>) => {
    let port = portIndex[props.data.value];
    return (
      <components.Option {...props}>
        <PortOptionComponent
          id={port.id}
          area={port.area}
          region={port.region}
          text={port.text}
          focused={props.isFocused}
          connected={!!port.toID}
          selected={props.isSelected}
        />
      </components.Option>
    );
  };

  const SingleValue = (props: SingleValueProps<PortOption>) => {
    let port = portIndex[props.data.value];
    return (
      <components.SingleValue {...props}>
        <PortOptionComponent
          id={port.id}
          area={port.area}
          region={port.region}
          text={port.text}
          focused={false}
          connected={false}
          selected={false}
        />
      </components.SingleValue>
    );
  };

  const filterOption = (
    option: FilterOptionOption<PortOption>,
    inputValue: string
  ) => {
    let port = _.find(ports, (x) => x.id == option.value);
    if (!port) {
      return false;
    }
    return (
      port.area.toLowerCase().includes(inputValue.toLowerCase()) ||
      port.text.toLowerCase().includes(inputValue.toLowerCase()) ||
      port.region.toLowerCase().includes(inputValue.toLowerCase()) ||
      port.id.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const onChange = (
    selected: SingleValue<PortOption> | MultiValue<PortOption>,
    action: ActionMeta<PortOption>
  ) => {
    if (selected == null) {
      dispatch(setConnection({ from: port.id, to: null }));
    } else if (!_.isArray(selected)) {
      dispatch(
        setConnection({ from: port.id, to: (selected as PortOption).value })
      );
    }
  };

  let fromLabel: string | undefined = undefined;
  if (port.fromID && (port.fromID !== port.toID || port.exitOnly)) {
    let fromPort = portIndex[port.fromID];
    if (fromPort) {
      fromLabel = `${fromPort.region} / ${fromPort.area} / ${fromPort.text}`;
    }
  }

  return (
    <div className="port">
      <div className="port__info">
        <div className="port__label">{port.text}</div>
        {fromLabel && <div className="port__from">From {fromLabel}</div>}
      </div>

      <div className="port__value">
        {port.exitOnly && <div className={"port__exitOnly"}>Exit Only</div>}
        {!port.exitOnly && (
          <Select
            onChange={onChange}
            filterOption={filterOption}
            classNamePrefix="port-select"
            closeMenuOnSelect={true}
            isClearable={true}
            options={options}
            menuPlacement="auto"
            components={{ Option, SingleValue }}
            value={selectedOption}
            placeholder={
              <div className="portPlaceholder">
                <span className="portPlaceholder__text">???</span>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
