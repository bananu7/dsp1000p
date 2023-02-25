import { useState, useEffect, useCallback } from 'react'
import { Display } from "react-7-segment-display";

import { MidiClient } from '../backend/midi'
import { Parameter } from '../backend/dsp_constants'

export function ProgramSelector(props: { client: MidiClient }) {
  const programUp = () => {
    if (programId >= 99)
      return;
    setProgramId(id => id + 1);
    props.client.sendProgramChange(programId + 1);
  }

  const programDown = () => {
    if (programId <= 0)
      return;
    setProgramId(id => id - 1);
    props.client.sendProgramChange(programId - 1);
  }

  const [programId, setProgramId] = useState(0);

  return (
    <div className="ProgramSelector">
      <Display
        count={2}
        color="green"
        value={programId+1}
        height={80}
        skew={true}
        backgroundColor="black"
      />
      <button onClick={programDown}>🡇</button>
      <button onClick={programUp}>🡅</button>
    </div>
  );
}
