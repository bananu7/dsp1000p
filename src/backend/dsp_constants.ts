export enum Parameter {
  EFFECT = 20,    // 0..31
  VARIATION = 21, // 0..31
  ENGINE = 22,    // 0,1,2
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