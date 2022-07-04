import {
  Flag,
  FlagGroup,
  GameLayout,
  Area,
  Region,
  Port,
  Condition,
  Egress,
} from "tracker/GameLayout";
import _ from "lodash";

type DefinitionMap<T> = {
  [key: string]: T;
};

export interface GameLayoutDefinition {
  flagGroups: DefinitionMap<FlagGroupDefinition>;
  regions: DefinitionMap<RegionDefinition>;
}

export interface FlagGroupDefinition {
  title: string;

  flags: DefinitionMap<FlagDefinition>;
}

export interface FlagDefinition {
  name: string;
}

export interface RegionDefinition {
  name: string;
  areas: DefinitionMap<AreaDefinition>;
}

export interface AreaDefinition {
  name: string;
  ports: DefinitionMap<PortDefinition>;
  egress: DefinitionMap<EgressDefinition>;
  warpable?: boolean;
}

export interface ConditionalDefinition {
  if?: string | string[];
  ifNot?: string | string[];
}

export interface PortDefinition extends ConditionalDefinition {
  name: string;
  egress?: string;
}

export interface EgressDefinition extends ConditionalDefinition {
  note?: string;
}

export function loadGameLayout(definition: GameLayoutDefinition): GameLayout {
  let result = new GameLayout();
  console.log(definition);

  const mkFlagGroup = (id: string, flagGroupDef: FlagGroupDefinition) => {
    return new FlagGroup(
      flagGroupDef.title,
      _.toPairs(flagGroupDef.flags).map(([id, def]) => mkFlag(id, def))
    );
  };

  const mkFlag = (id: string, flagDef: FlagDefinition) => {
    return new Flag(id, flagDef.name);
  };

  const mkRegion = (id: string, regionDef: RegionDefinition) => {
    let region = new Region(id, regionDef.name);
    region.areas = _.toPairs(regionDef.areas).map(([id, def]) =>
      mkArea(id, def)
    );
    return region;
  };

  const mkArea = (id: string, areaDef: AreaDefinition) => {
    let area = new Area(id, areaDef.name);
    if (areaDef.warpable) {
      area.tags.push("warpable");
    }
    area.ports = _.toPairs(areaDef.ports).map(([id, def]) => mkPort(id, def));
    area.egresses = _.toPairs(areaDef.egress).map(([id, def]) =>
      mkEgress(id, def)
    );
    return area;
  };

  const mkPort = (id: string, portDef: PortDefinition) => {
    let port = new Port(id, portDef.name);
    port.condition = mkCondition(portDef);
    return port;
  };

  const mkEgress = (id: string, egressDef: EgressDefinition) => {
    let egress = new Egress(id, egressDef.note);
    egress.condition = mkCondition(egressDef);
    return egress;
  };

  const mkCondition = (conditional: ConditionalDefinition) => {
    let require: string[] = [];
    let exclude: string[] = [];

    if (_.isArray(conditional.if)) {
      require = conditional.if;
    } else if (_.isString(conditional.if)) {
      require = [conditional.if];
    }

    if (_.isArray(conditional.ifNot)) {
      exclude = conditional.ifNot;
    } else if (_.isString(conditional.ifNot)) {
      exclude = [conditional.ifNot];
    }

    return new Condition(exclude, require);
  };

  result.flagGroups = _.toPairs(definition.flagGroups).map(([id, def]) =>
    mkFlagGroup(id, def)
  );
  result.regions = _.toPairs(definition.regions).map(([id, def]) =>
    mkRegion(id, def)
  );

  return result;
}
