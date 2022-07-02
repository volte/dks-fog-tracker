import {GameLayout} from "tracker/GameLayout";

export class Tracker {
  readonly layout: GameLayout;

  private flags: Set<string> = new Set();

  constructor(layout: GameLayout) {
    this.layout = layout;
  }

  setFlag(flag: string, enabled: boolean) {
    if (enabled) {
      this.flags.add(flag);
    } else {
      this.flags.delete(flag);
    }
  }

  getFlag(flag: string) {
    return this.flags.has(flag)
  }
}