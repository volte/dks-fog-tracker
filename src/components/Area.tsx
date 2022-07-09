import { AreaState, PortState } from "store/regionsSlice";
import { Port } from "components/Port";
import tinycolor from "tinycolor2";
import useBreakpoint, { lg, md } from "util/useBreakpoint";
import classNames from "classnames";

interface AreaProps {
  regionName: string;
  regionID: string;
  showRegionHeader?: boolean;
  regionColor?: string;
  area: AreaState;
  filter: string;
}

export function Area({
  regionName,
  regionID,
  showRegionHeader,
  area,
  regionColor,
  filter,
}: AreaProps) {
  regionColor ||= "#ffffff";

  let cls = classNames({
    areaContainer: true,
  });

  let filteredPorts: PortState[] = [];
  let filterString = filter.toLowerCase();
  for (let port of area.ports) {
    let label = `${port.id}--${port.region}--${port.area}--${port.text}`;
    if (label.toLowerCase().includes(filterString)) {
      filteredPorts.push(port);
    }
  }

  return (
    <div className={cls}>
      {showRegionHeader && (
        <div className="regionHeader">
          <a id={regionID}>{regionName}</a>
        </div>
      )}
      <div
        className="area"
        style={{
          backgroundColor: regionColor,
        }}
      >
        <div className="areaHeader">{area.name}</div>
        {filteredPorts.map((p) => (
          <Port key={p.id} port={p} />
        ))}
      </div>
    </div>
  );
}
