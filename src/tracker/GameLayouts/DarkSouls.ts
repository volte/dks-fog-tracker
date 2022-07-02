import {Condition, GameLayout, makeRegion, Region} from "tracker/GameLayout";
import {cond} from "lodash";

export let darkSoulsGameLayout: GameLayout = {
  flagGroups: [
    {
      name: "Key Items",
      flags: [
        {id: "lordvessel", name: "Lordvessel"},
        {id: "key_to_the_seal", name: "Key to the Seal"},
        {id: "blighttown_key", name: "Blighttown Key"},
        {id: "key_to_depths", name: "Key to the Depths"},
        {id: "covenant_of_artorias", name: "Covenant of Artorias"},
        {id: "orange_charred_ring", name: "Orange Charred Ring"},
        {id: "basement_key", name: "Basement Key"},
        {id: "undead_asylum_f2_west_key", name: "Undead Asylum F2 West Key"},
        {id: "annex_key", name: "Annex Key"},
        {id: "watchtower_basement_key", name: "Watchtower Basement Key"},
        {id: "darkmoon_seance_ring", name: "Darkmoon Seance Ring"},
        {id: "key_to_new_londo_ruins", name: "Key to New Londo Ruins"},
        {id: "cage_key", name: "Cage Key"},
        {id: "archive_prison_extra_key", name: "Archive Prison Extra Key"},
        {id: "archive_tower_giant_cell_key", name: "Archive Tower Giant Cell Key"},
        {id: "archive_tower_giant_door_key", name: "Archive Tower Giant Door Key"},
        {id: "peculiar_doll", name: "Peculiar Doll"},
        {id: "broken_pendant", name: "Broken Pendant"},
        {id: "crest_key", name: "Crest Key"},
        {id: "crest_of_artorias", name: "Crest of Artorias"},
        {id: "residence_key", name: "Residence Key"},
        {id: "cast_light", name: "Cast Light"},
        {id: "lord_soul_shard_seath", name: "Lord Soul Shard (Seath)"},
        {id: "lord_soul_shard_four_kings", name: "Lord Soul Shard (Four Kings)"},
        {id: "lord_soul_bed_of_chaos", name: "Lord Soul (Bed of Chaos)"},
        {id: "lord_soul_nito", name: "Lord Soul (Nito)"},
        {id: "purple_cowards_crystal", name: "Purple Coward's Crystal"}
      ]
    },
    {
      name: "Shortcuts",
      flags: [
        {id: "firelink_elevator", name: "Firelink Elevator"}
      ]
    },
    {
      name: "Randomizer Settings",
      flags: [
        {id: "randomize_world", name: "Randomize Progression Fog Gates"},
        {id: "randomize_boss", name: "Randomize Boss Fog Gates"},
        {id: "randomize_warp", name: "Randomize Warps"},
        {id: "randomize_major", name: "Randomize Major PVP Gates"},
        {id: "randomize_minor", name: "Randomize Minor PVP Gates"},
        {id: "randomize_lordvessel", name: "Randomize Lordvessel Gates"},
      ]
    }
  ],
  regions: [
    makeRegion("firelink", "Firelink Shrine", b => {
      b.subregion("firelink_crow", "Crow's Nest", b => {
        b.egress("firelink");
      });

      b.egress("firelink_crow", "Up Elevator", {require: ["firelink_elevator"]}, true);

      b.port("firelink_newlondo_gate", "Gate to New Londo Ruins", {require: ["randomize_major"]});
    }),
  ]
};

