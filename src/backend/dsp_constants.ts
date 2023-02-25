export enum Parameter {
  EFFECT = 20,    // 0..31
  VARIATION = 21, // 0..31
  ENGINE = 22,    // 0,1,2 - 0 is couple, 1 is L, 2 is R
  EDIT_A = 23,    // 0..63 / 0..100 (cents)
  EDIT_B = 24,    // 0..63 / 0..24 (semitones)
  EQ_LO  = 25,    // 0..32 (corresponds to -16..16)
  EQ_HI  = 26,    // 0..32 (corresponds to -16..16)
  MIX    = 27,    // 0..100
  STORE  = 28,    // 0..99
  IN_OUT = 29,    // 0,1
  MIX_INT_EXT = 30,  // 0,1
}

export enum EffectType {
  CATHEDRAL = 1,
  PLATE = 2,
  SMALL_HALL = 3,
  ROOM = 4,
  STUDIO = 5,
  CONCERT = 6,
  STAGE = 7,
  VOCAL = 8,
  PERCUSSION = 9,
  DELAY = 10,
  ECHO = 11,
  GATED_REVERB = 12,
  REVERSE_REVERB = 13,
  VOCAL_DISTORTION = 14,
  ROTARY_SPEAKER = 15,
  VOCODER = 16,
  PITCH = 17,
  FLANGER = 18,
  CHORUS = 19,
  // Combined
  TREMOLO_PLUS_DELAY = 20,
  DELAY_PLUS_REVERB = 21,
  PITCH_PLUS_REVERB = 22,
  FLANGER_PLUS_REVERB = 23,
  CHORUS_PLUS_REVERB = 24,
  // Separate L/R
  PITCH_AND_REVERB = 25,
  FLANGER_AND_REVERB = 26,
  CHORUS_AND_REVERB = 27,
  TREMOLO_AND_REVERB = 28,
  DELAY_AND_REVERB = 29,
  PITCH_AND_ECHO = 30,
  FLANGER_AND_ECHO = 31,
  CHORUS_AND_ECHO = 32
}

/*

Effects can have up to 5 parameters.
They are
 - Variation
 - Edit A - Engine L
 - Edit A - Engine R
 - Edit B - Engine L
 - Edit B - Engine R

Not all engines make use of it all. E.g. CATHEDRAL
has 4 parameters:
 - Reverb Time -> Variation
 - Diffusion -> Edit A (impossible to choose Engine, both always light up)
 - Early Reflections -> Edit B, Engine L
 - High Multiply -> Edit B, Engine R

In order to set the parameters, first Engine needs to be set to the appropriate one,
then edit a or b can be changed.

*/

export type Variation = {
  variation: string
}

export type ReverbParameters = Variation & {
  type: "reverb",
  editA: string,
  editBL: string,
  editBR: string
}

// Delay, Echo, Flanger, Pitch, Chorus
export type StereoParameters = Variation & {
  type: "stereo" | "delay",
  editA: string,
  editB: string,
}

export type SpecialParameters = Variation & {
  type: "special",
  editA: string,
  editB: string
}

export type DualEffectParameter = Variation & {
  type: "dual",
  editAL: string,
  editAR: string,
  editBL: string,
  editBR: string
}

export type ParameterData =
  ReverbParameters |
  StereoParameters |
  SpecialParameters |
  DualEffectParameter;

export type ParametersData = {
  [key: number]: ParameterData
};

export const parameterData: ParametersData = {
  [EffectType.CATHEDRAL]: {
    type: "reverb",
    variation: "Reverb Time",
    editA: "Diffusion",
    editBL: "Early Reflections",
    editBR: "High Multiply",
  },

  [EffectType.PLATE]: {
    type: "reverb",
    variation: "Reverb Time",
    editA: "Pre Delay",
    editBL: "Stereo Width",
    editBR: "High Multiply",
  },

  [EffectType.SMALL_HALL]: {
    type: "reverb",
    variation: "Reverb Time",
    editA: "Diffusion",
    editBL: "Early Reflections",
    editBR: "Stereo Width",
  },

  [EffectType.ROOM]: {
    type: "special",
    variation: "Reverb Time",
    editA: "Pre Delay",
    editB: "Wall Damp"
  },

  [EffectType.STUDIO]: {
    type: "reverb",
    variation: "Reverb Time",
    editA: "Pre Delay",
    editBL: "Early Reflections",
    editBR: "Wall Damp"
  },

  [EffectType.CONCERT]: {
    type: "reverb",
    variation: "Reverb Time",
    editA: "Pre Delay",
    editBL: "Early Reflections",
    editBR: "Diffusion"
  },

  [EffectType.STAGE]: {
    type: "reverb",
    variation: "Reverb Time",
    editA: "Diffusion",
    editBL: "Liveliness",
    editBR: "Stereo Width",
  },

  [EffectType.VOCAL]: {
    type: "reverb",
    variation: "Reverb Time",
    editA: "Pre Delay",
    editBL: "Early Reflections",
    editBR: "High Multiply",
  },

  [EffectType.PERCUSSION]: {
    type: "special",
    variation: "Reverb Time",
    editA: "Diffusion",
    editB: "High Frequency Decay"
  },

  [EffectType.DELAY]: {
    type: "stereo",
    variation: "Del. Coarse",
    editA: "Delay Time",
    editB: "Feedback",
  },

  [EffectType.ECHO]: {
    type: "stereo",
    variation: "Del. Coarse",
    editA: "Delay Time",
    editB: "Feedback",
  },

  [EffectType.GATED_REVERB]: {
    type: "special",
    variation: "Gate Time",
    editA: "Density",
    editB: "Gate Threshold",
  },

  [EffectType.REVERSE_REVERB]: {
    type: "special",
    variation: "Gate Time",
    editA: "Pre Delay",
    editB: "Gate Threshold",
  },

  [EffectType.VOCAL_DISTORTION]: {
    type: "special",
    variation: "Distortion Type",
    editA: "Delay Time (x 10ms)",
    editB: "Delay Mix",
  },

  [EffectType.ROTARY_SPEAKER]: {
    type: "special",
    variation: "Rotary Type",
    editA: "Horn Speed",
    editB: "Rotor Speed",
  },

  [EffectType.VOCODER]: {
    type: "special",
    variation: "Vocoder Type",
    editA: "Vocoder Distortion",
    editB: "Vocoder Sens",
  },

  [EffectType.PITCH]: {
    type: "stereo",
    variation: "", // todo?
    editA: "Cent",
    editB: "Semi Tone",
  },

  [EffectType.FLANGER]: {
    type: "stereo",
    variation: "Mod. Frequency",
    editA: "Mod. Depth",
    editB: "Mod. Feedback",
  },

  [EffectType.CHORUS]: {
    type: "stereo",
    variation: "Mod. Frequency",
    editA: "Mod. Delay",
    editB: "Mod. Depth",
  },

  // TODO: fill in dual effets
};
