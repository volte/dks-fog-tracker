import { GameLayout, Region } from "tracker/GameLayout";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { selectFlags } from "store/flagsSlice";
import { AreaState, RegionState, selectRegions } from "store/regionsSlice";
import { Area } from "components/Area";
import { Fragment } from "react";
import useBreakpoint, { lg, md } from "util/useBreakpoint";
import classNames from "classnames";

interface AreaListProps {
  layout: GameLayout;
  filter: string;
}

export function AreaList({ layout, filter }: AreaListProps) {
  const dispatch = useAppDispatch();
  const regions = useAppSelector(selectRegions);

  const renderRegion = (region: RegionState) => {
    let filteredAreas: AreaState[] = [];
    let filterString = filter.toLowerCase();
    for (let area of region.areas) {
      if (
        region.name.toLowerCase().includes(filterString) ||
        area.name.toLowerCase().includes(filterString)
      ) {
        filteredAreas.push(area);
        continue;
      }

      for (let port of area.ports) {
        if (
          port.text.toLowerCase().includes(filterString) ||
          port.id.toLowerCase().includes(filterString)
        ) {
          filteredAreas.push(area);
          break;
        }
      }
    }

    if (filteredAreas.length === 0) {
      return <Fragment key={region.id}></Fragment>;
    }

    return (
      <Fragment key={region.id}>
        <Area
          key={filteredAreas[0].id}
          area={filteredAreas[0]}
          regionID={region.id}
          regionName={region.name}
          showRegionHeader={true}
          regionColor={region.color}
          filter={filter}
        />
        {filteredAreas.slice(1).map((area) => (
          <Area
            key={area.id}
            area={area}
            regionID={region.id}
            regionName={region.name}
            showRegionHeader={false}
            regionColor={region.color}
            filter={filter}
          />
        ))}
      </Fragment>
    );
  };

  let cls = classNames({
    areaList: true,
  });

  return (
    <div className={cls}>{regions.map((region) => renderRegion(region))}</div>
  );
}
