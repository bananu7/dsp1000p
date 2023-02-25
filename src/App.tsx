import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api'

function ProgramSelector() {
  const sendProgramChange = (programId: number) => {
    console.log("sending program change", programId)
    invoke('send_program_change', { value: programId });
  };

  const programUp = () => {
    if (programId >= 99)
      return;
    setProgramId(id => id + 1);
    sendProgramChange(programId + 1);
  }

  const programDown = () => {
    if (programId <= 0)
      return;
    setProgramId(id => id - 1);
    sendProgramChange(programId - 1);
  }

  const [programId, setProgramId] = useState(0);

  return (
    <div className="ProgramSelector">
      <span>{programId+1}</span>
      <button onClick={programUp}>Up</button>
      <button onClick={programDown}>Down</button>
    </div>
  );

}

function App() {
  const [count, setCount] = useState(0)

  const openMidi = async () => {
    console.log("opening midi");
    const result = await invoke('open_midi_connection', { outputPortIdx: 1 });
    console.log("midi opened");
  };

  return (
    <div className="App">
      <h1>DSP1000P</h1>
      <div className="card">
        <button onClick={() => openMidi()}>
          openMidi
        </button>
        <p>Click to open midi</p>
        <ProgramSelector />
      </div>
      <p className="read-the-docs">
        Yoo it works
      </p>
    </div>
  )
}

export default App
