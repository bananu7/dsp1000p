import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api'

import {MidiClient, connectMidi} from './backend/midi'
import {EffectType, Parameter} from './backend/dsp_constants'

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

type ParamProps = {
  client: MidiClient,
  param: number,
  min: number,
  max: number,
}
function Param(props: ParamProps) {
  const [value, setValue] = useState(0);
  const changeValue = (v: number) => {
    console.log("change value")
    props.client.sendCC(props.param, v-1); // TODO zero-based
    setValue(v);
  }

  return (
    <div className="ProgramSelector">
      <label>Variation</label>
      <input
        type="number"
        min={props.min}
        max={props.max}
        value={value}
        onChange={e => changeValue(Number(e.target.value))}
      />
    </div>
  );
}

function EffectPanel(props: { client: MidiClient, effectType: EffectType }) {
  return (
    <div className="EffectPanel">
      <span>{EffectType[props.effectType]}</span>
      <Param client={props.client} param={21} min={1} max={32} />
    </div>
  )
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
          <EffectPanel client={midiClient} effectType={EffectType.PLATE} />
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
