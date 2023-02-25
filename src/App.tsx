import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api'

import {MidiClient, connectMidi} from './backend/midi'

function ProgramSelector(props: { client: MidiClient }) {
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
      <span>{programId+1}</span>
      <button onClick={programDown}>🡇</button>
      <button onClick={programUp}>🡅</button>
    </div>
  );
}

function Param(props: { client: MidiClient, param: number }) {
  const sendCC = () => {
    props.client.sendCC(props.param, 10);
  }

  return (
    <div className="ProgramSelector">
      <button onClick={sendCC}>sendParam</button>
    </div>
  );
}

function App() {
  const [midiClient, setMidiClient] = useState<MidiClient | null>(null);

  const openMidi = async () => {
    const client = await connectMidi();
    setMidiClient(client);
  };

  return (
    <div className="App">
      <h1>DSP1000P</h1>
      { midiClient ?
        <div>
          <ProgramSelector client={midiClient}/>
          <Param client={midiClient} param={21} />
        </div>
        :
        <div className="card">
          <p>Click to open midi</p>
          <button onClick={openMidi}>openMidi</button>
        </div>
      }
      <p className="read-the-docs">
        Made with ❤️ with React+Tauri.
      </p>
    </div>
  )
}

export default App
