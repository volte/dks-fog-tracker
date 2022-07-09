import {
  checkCondition,
  Condition,
  GameLayout,
  Area,
  Region,
} from "tracker/GameLayout";
import * as Rx from "rxjs";
import Graph from "graphology";
import _ from "lodash";

export type TrackerEvent =
  | { type: "layoutIndexRebuilt" }
  | { type: "flagsChanged" };

export interface RegionInfo {
  id: string;
  name: string;
  areas: string[];
  color?: string;
}

export interface AreaInfo {
  id: string;
  name: string;
  region: string;
  egress: EgressInfo[];
  ports: string[];
}

export interface PortInfo {
  id: string;
  area: string;
  region: string;
  from?: string;
  to?: string;
  exitOnly?: boolean;
  text?: string;
}

export type ConnectionMap = { [id: string]: string };

export interface EgressInfo {
  destination: string;
  text?: string;
  port?: string;
  destPort?: string;
}

class LayoutIndex {
  readonly layout: GameLayout;

  regions: { [id: string]: RegionInfo } = {};
  areas: { [id: string]: AreaInfo } = {};
  ports: { [id: string]: PortInfo } = {};

  flags: string[] = [];
  connections: ConnectionMap = {};
  connectionsBack: ConnectionMap = {};

  constructor(layout: GameLayout) {
    this.layout = layout;
  }

  rebuild() {
    this.regions = {};
    this.ports = {};
    this.areas = {};

    this.connectionsBack = _.invert(this.connections);

    for (let region of this.layout.regions) {
      this.processRegion(region);
    }
  }

  private processRegion(region: Region) {
    if (!_.has(this.regions, region.id)) {
      this.regions[region.id] = {
        id: region.id,
        name: region.name,
        color: region.color,
        areas: [],
      };
    }

    for (let area of region.areas) {
      this.regions[region.id].areas.push(area.id);
      this.processArea(area, region.id);
    }
  }

  private processArea(area: Area, region: string) {
    if (!_.has(this.areas, area.id)) {
      this.areas[area.id] = {
        id: area.id,
        name: area.name,
        region: region,
        egress: [],
        ports: [],
      };
    }

    let egresses = area.egresses || [];
    for (let egress of egresses) {
      if (egress.condition.check(this.flags)) {
        this.areas[area.id].egress.push({
          destination: egress.destination,
          text: egress.text,
        });
      }
    }

    let ports = area.ports || [];
    for (let port of ports) {
      if (port.condition.check(this.flags)) {
        let toPort = this.connections[port.id];
        let fromPort = this.connectionsBack[port.id];
        this.ports[port.id] = {
          id: port.id,
          text: port.text,
          area: area.id,
          region: region,
          exitOnly: port.tags.includes("exitOnly"),
          to: toPort,
          from: fromPort,
        };
        this.areas[area.id].ports.push(this.ports[port.id].id);
      }
    }
  }
}

export class Tracker {
  readonly layout: GameLayout;
  readonly layoutIndex: LayoutIndex;

  private eventSubject$ = new Rx.Subject<TrackerEvent>();

  private enabledFlags: Set<string> = new Set();
  private connectionMap: ConnectionMap = {};
  private graph: Graph = new Graph();
  alwaysTwoWay: boolean = true;

  get events$(): Rx.Observable<TrackerEvent> {
    return this.eventSubject$.asObservable();
  }

  constructor(layout: GameLayout) {
    this.layout = layout;
    this.layoutIndex = new LayoutIndex(layout);
    this.rebuildLayout();
  }

  setFlag(flag: string, enabled: boolean) {
    if (enabled) {
      this.enabledFlags.add(flag);
    } else {
      this.enabledFlags.delete(flag);
    }
    this.save();
    this.rebuildLayout();
    this.sendEvent({ type: "flagsChanged" });
  }

  get flags() {
    return [...this.enabledFlags.values()];
  }

  deleteConnection(fromPort: string) {
    if (this.alwaysTwoWay) {
      let toPort = this.connectionMap[fromPort];
      if (toPort) {
        delete this.connectionMap[toPort];
      }
    }
    delete this.connectionMap[fromPort];
  }

  createConnection(fromPort: string, toPort: string) {
    if (this.alwaysTwoWay) {
      this.connectionMap[toPort] = fromPort;
    }
    this.connectionMap[fromPort] = toPort;
  }

  makeConnection(fromPort: string, toPort: string | null) {
    this.deleteConnection(fromPort);
    if (toPort !== null) {
      if (this.alwaysTwoWay) {
        this.deleteConnection(toPort);
      }
      this.createConnection(fromPort, toPort);
    }

    this.save();
    this.rebuildLayout();
  }

  get connections() {
    return Object.keys(this.connectionMap).map((id) => ({
      from: id,
      to: this.connectionMap[id],
    }));
  }

  rebuildLayout() {
    this.layoutIndex.flags = [...this.enabledFlags.values()];
    this.layoutIndex.connections = { ...this.connectionMap };
    this.layoutIndex.rebuild();
    this.sendEvent({ type: "layoutIndexRebuilt" });
    this.graph.clear();
  }

  getData() {
    return JSON.stringify(
      {
        flags: this.flags,
        connectionMap: this.connectionMap,
        alwaysTwoWay: this.alwaysTwoWay,
      },
      null,
      2
    );
  }

  setData(json: string) {
    let state: any = JSON.parse(json);
    this.enabledFlags = new Set(state.flags || []);
    this.connectionMap = state.connectionMap || {};
    this.alwaysTwoWay = state.alwaysTwoWay || true;
  }

  save() {
    let json = this.getData();
    window.localStorage.setItem("state", json);
  }

  load() {
    let data = window.localStorage.getItem("state") || "{}";
    this.setData(data);
    this.rebuildLayout();
    this.sendEvent({ type: "flagsChanged" });
  }

  private sendEvent(event: TrackerEvent) {
    this.eventSubject$.next(event);
  }
}
