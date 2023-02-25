import { useState, useEffect, useCallback } from 'react'
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

function BypassSwitch(props: { client: MidiClient }) {
  const [bypass, setBypass] = useState(false);
  const onChangeBypass = useCallback((e) => {
    const v = Boolean(e.target.checked);
    props.client.sendCC(Parameter.IN_OUT, v ? 0 : 1); // TODO 0 means disable?
    setBypass(v);
  }, [props.client]);

  return (
    <div className="BypassSwitch">
      <label>Bypass</label>
      <input type="checkbox" name="bypass" value="bypass" onChange={onChangeBypass} />
    </div>
  )
}

function MixSlider(props: { client: MidiClient }) {
  const [mix, setMix] = useState(20);
  const onChange = useCallback((e) => {
    const v = Number(e.target.value);
    props.client.sendCC(Parameter.MIX, v);
    setMix(v);
  }, [props.client]);

  return (
    <div className="MixSlider">
      <label>Mix</label>
      <input type="range" min="1" max="100" value={mix} onChange={onChange} name="mix" />
    </div>
  )
}

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

type ParamProps = {
  client: MidiClient,
  param: number,
  min: number,
  max: number,
  label: string,
  engine?: number,
}
function Param(props: ParamProps) {
  const [value, setValue] = useState(0);
  const changeValue = (v: number) => {
    console.log("change value")

    if (props.engine) {
      props.client.sendCC(Parameter.ENGINE, props.engine);
    }

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
        value={value} // TODO for some variation this needs -1
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
        engine={1}
      />
      <Param
        client={props.client}
        param={Parameter.EDIT_B}
        min={1}
        max={64}
        label={props.parameters.editBR}
        engine={2}
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
