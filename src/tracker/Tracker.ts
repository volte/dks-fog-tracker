import {
  checkCondition,
  Condition,
  GameLayout,
  Region,
} from "tracker/GameLayout";
import * as Rx from "rxjs";
import Graph from "graphology";
import _ from "lodash";

export type TrackerEvent = { type: "layoutIndexRebuilt" };

export interface RegionInfo {
  id: string;
  name: string;
  parent: string | null;
  children: string[];
  egresses: EgressInfo[];
  ports: PortInfo[];
}

export interface PortInfo {
  id: string;
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
  ports: { [id: string]: PortInfo } = {};

  flags: string[] = [];
  connections: ConnectionMap = {};

  constructor(layout: GameLayout) {
    this.layout = layout;
  }

  rebuild() {
    this.regions = {};
    this.ports = {};

    for (let region of this.layout.regions) {
      this.processRegion(region, null);
    }
  }

  private processRegion(region: Region, parent: string | null) {
    if (!_.has(this.regions, region.id)) {
      this.regions[region.id] = {
        id: region.id,
        name: region.name,
        parent: parent,
        children: [],
        egresses: [],
        ports: [],
      };
    }

    let subRegions = region.subRegions || [];
    for (let subRegion of subRegions) {
      this.regions[region.id].children.push(subRegion.id);
      this.processRegion(subRegion, region.id);
    }

    let egresses = region.egresses || [];
    for (let egress of egresses) {
      if (checkCondition(egress.condition, this.flags)) {
        this.regions[region.id].egresses.push({
          destination: egress.destination,
          text: egress.text,
        });
      }
    }

    let ports = region.ports || [];
    for (let port of ports) {
      if (checkCondition(port.condition, this.flags)) {
        this.ports[port.id] = {
          id: port.id,
          text: port.text,
        };
        this.regions[region.id].ports.push(this.ports[port.id]);
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
    this.layoutIndex.flags = [...this.enabledFlags.values()];
    this.rebuildLayout();
  }

  get flags() {
    return [...this.enabledFlags.values()];
  }

  makeConnection(fromPort: string, toPort: string | null) {
    if (toPort !== null) {
      this.connectionMap[fromPort] = toPort;
    } else {
      delete this.connectionMap[fromPort];
    }
    this.layoutIndex.connections = this.connectionMap;
    this.rebuildLayout();
  }

  get connections() {
    return Object.keys(this.connectionMap).map((id) => ({
      from: id,
      to: this.connectionMap[id],
    }));
  }

  rebuildLayout() {
    this.layoutIndex.rebuild();
    this.sendEvent({ type: "layoutIndexRebuilt" });

    this.graph.clear();
  }

  private sendEvent(event: TrackerEvent) {
    this.eventSubject$.next(event);
  }
}
