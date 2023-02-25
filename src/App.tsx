import { useState, useEffect } from 'react'
import './App.css'

import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api'

import { Display } from "react-7-segment-display";

import {MidiClient, connectMidi} from './backend/midi'
import {EffectType, Parameter, parameterData, ReverbParameters} from './backend/dsp_constants'

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

type ParamProps = {
  client: MidiClient,
  param: number,
  min: number,
  max: number,
  label: string,
}
function Param(props: ParamProps) {
  const [value, setValue] = useState(0);
  const changeValue = (v: number) => {
    console.log("change value")
    props.client.sendCC(props.param, v-1); // TODO zero-based
    setValue(v);
  }

  return (
    <div className="Param">
      <label>{props.label}</label>
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

function ReverbEffectPanel(props: { 
  client: MidiClient,
  effectType: EffectType,
  parameters: ReverbParameters }
) {
  return (
    <div className="EffectPanel">
      <span>{EffectType[props.effectType]}</span>
      <Param
        client={props.client}
        param={Parameter.VARIATION}
        min={1}
        max={32}
        label={props.parameters.variation}
      />

      <Param
        client={props.client}
        param={Parameter.EDIT_A}
        min={1}
        max={64}
        label={props.parameters.editA}
      />
      <Param
        client={props.client}
        param={Parameter.EDIT_B}
        min={1}
        max={64}
        label={props.parameters.editBL}
      />
      <Param
        client={props.client}
        param={Parameter.EDIT_B}
        min={1}
        max={64}
        label={props.parameters.editBR}
      />
    </div>
  )
}

function EffectPanel(props: { client: MidiClient, effectType: EffectType }) {
  const data = parameterData[props.effectType];

  if (data.type == "reverb") {
    return (
      <ReverbEffectPanel
        client={props.client}
        effectType={props.effectType}
        parameters={data}
      />
    );
  } else {
    return (<span>This effect is not supported yet</span>);
  }
}

function App() {
  const [midiClient, setMidiClient] = useState<MidiClient | null>(null);

  const openMidi = async () => {
    const client = await connectMidi();
    setMidiClient(client);
  };

  return (
    <div className="App">
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
