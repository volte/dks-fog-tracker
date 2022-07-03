import _ from "lodash";

export interface FlagGroup {
  name: string;
  flags: Flag[];
}

export interface Flag {
  id: string;
  name: string;
}

export interface Region {
  id: string;
  name: string;
  tags?: string[];
  ports?: Port[];
  egresses?: Egress[];
  subRegions?: Region[];
}

export interface Condition {
  exclude?: string[];
  require?: string[];
}

export interface Port {
  id: string;
  text: string;
  exitOnly: boolean | undefined;
  condition: Condition;
}

export interface Egress {
  text?: string;
  destination: string;
  condition: Condition;
  preserveEdge: boolean;
}

export interface GameLayout {
  flagGroups: FlagGroup[];
  regions: Region[];
}

export interface RegionBuilder {
  tag(text: string): void;

  port(
    id: string,
    text: string,
    condition?: Condition,
    exitOnly?: boolean
  ): void;

  egress(
    destination: string,
    text?: string,
    condition?: Condition,
    preserveEdge?: boolean
  ): void;

  subregion(
    id: string,
    text: string,
    builderFn: (b: RegionBuilder) => void
  ): void;
}

export function makeRegion(
  id: string,
  name: string,
  builderFn: (b: RegionBuilder) => void
): Region {
  let region: Region = {
    id: id,
    name: name,
    ports: [],
    egresses: [],
    tags: [],
    subRegions: [],
  };
  let builder: RegionBuilder = {
    egress(
      destination: string,
      text: string,
      condition?: Condition,
      preserveEdge?: boolean
    ): void {
      region.egresses ||= [];
      region.egresses.push({
        text: text,
        destination: destination,
        condition: condition || {},
        preserveEdge: preserveEdge || false,
      });
    },
    port(
      id: string,
      text: string,
      condition?: Condition,
      exitOnly?: boolean
    ): void {
      region.ports ||= [];
      region.ports.push({
        id: id,
        text: text,
        exitOnly: exitOnly || false,
        condition: condition || {},
      });
    },
    subregion(
      id: string,
      name: string,
      builderFn: (b: RegionBuilder) => void
    ): void {
      region.subRegions ||= [];
      let newRegion = makeRegion(id, name, builderFn);
      region.subRegions.push(newRegion);
    },
    tag(text: string): void {
      region.tags ||= [];
      region.tags.push(text);
    },
  };
  builderFn(builder);
  return region;
}

export function checkCondition(condition: Condition, flags: string[]) {
  let require = condition.require || [];
  let exclude = condition.exclude || [];
  if (_.intersection(exclude, flags).length > 0) {
    return false;
  }
  if (_.difference(require, flags).length > 0) {
    return false;
  }
  return true;
}