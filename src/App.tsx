import { useState, useEffect, useCallback } from 'react'
import './App.css'

import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api'

import { Display } from "react-7-segment-display";

import {MidiClient, connectMidi} from './backend/midi'
import {EffectType, Parameter, parameterData, ReverbParameters, StereoParameters} from './backend/dsp_constants'
import {EffectPanel, ReverbEffectPanel, StereoEffectPanel} from './components/EffectPanel'
import {BypassSwitch} from './components/BypassSwitch'
import {MixSlider} from './components/MixSlider'
import {ProgramSelector} from './components/ProgramSelector'

function EffectSelector(props: { client: MidiClient, effectType: EffectType, setEffectType: (et: EffectType) => void }) {
  const options = (Object.keys(EffectType) as Array<keyof typeof EffectType>)
    .filter(i => !isNaN(Number(i)))
    .map(et => 
      <option key={et} value={et}>{EffectType[et]}</option>
    );

  const onChange = useCallback((e) => {
    const et = Number(e.target.value);
    props.client.sendCC(Parameter.EFFECT, et-1);
    props.setEffectType(et);
  }, [props.client]);

  return (
    <div className="EffectSelector">
      <select name="effectType" onChange={onChange}>
        {options}
      </select>
    </div>
  )
}


function ProgramEditor(props: { client: MidiClient }) {
  const midiClient = props.client;

  const [effectType, setEffectType] = useState(EffectType.PLATE);
  return (
    <>
      <BypassSwitch client={midiClient} />
      <MixSlider client={midiClient} />
      <EffectSelector client={midiClient} effectType={effectType} setEffectType={setEffectType}/>
      <EffectPanel client={midiClient} effectType={effectType} />
    </>
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
      { midiClient ?
        <div>
          <ProgramSelector client={midiClient}/>
          <ProgramEditor client={midiClient}/>
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
