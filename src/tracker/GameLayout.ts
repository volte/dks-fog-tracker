import _ from "lodash";

export class FlagGroup {
  name: string;
  flags: Flag[];

  constructor(name: string, flags: Flag[]) {
    this.name = name;
    this.flags = flags;
  }
}

export class Flag {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class Region {
  id: string;
  name: string;
  areas: Area[] = [];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class Area {
  id: string;
  name: string;
  tags: string[] = [];
  ports: Port[] = [];
  egresses: Egress[] = [];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class Condition {
  exclude?: string[];
  require?: string[];

  constructor(exclude?: string[], require?: string[]) {
    this.exclude = exclude;
    this.require = require;
  }

  check(flags: string[]) {
    let require = this.require || [];
    let exclude = this.exclude || [];
    if (_.intersection(exclude, flags).length > 0) {
      return false;
    }
    if (_.difference(require, flags).length > 0) {
      return false;
    }
    return true;
  }
}

export class Port {
  id: string;
  text: string;
  condition: Condition = new Condition();
  tags: string[] = [];

  constructor(id: string, text: string) {
    this.id = id;
    this.text = text;
  }
}

export class Egress {
  destination: string;
  text?: string;
  condition: Condition = new Condition();

  constructor(destination: string, text?: string) {
    this.destination = destination;
    this.text = text;
  }
}

export class GameLayout {
  flagGroups: FlagGroup[] = [];
  regions: Region[] = [];
}

export function checkCondition(condition: Condition, flags: string[]) {}
