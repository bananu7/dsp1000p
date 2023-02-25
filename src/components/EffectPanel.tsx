import {MidiClient } from '../backend/midi'
import {EffectType, Parameter, parameterData, ReverbParameters, StereoParameters} from '../backend/dsp_constants'
import {Param} from './Param'

export function ReverbEffectPanel(props: { 
  client: MidiClient,
  effectType: EffectType,
  parameters: ReverbParameters }
) {
  return (
    <div className="EffectPanel Reverb" >
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

export function StereoEffectPanel(props: { 
  client: MidiClient,
  effectType: EffectType,
  parameters: StereoParameters }
) {
  return (
    <div className="EffectPanel Delay" >
      <Param
        client={props.client}
        param={Parameter.VARIATION}
        min={1}
        max={32}
        label={props.parameters.variation}
      />

      <div>
        <Param
          client={props.client}
          param={Parameter.EDIT_A}
          min={1}
          max={64}
          label={props.parameters.editA}
          engine={1}
        />
        <Param
          client={props.client}
          param={Parameter.EDIT_B}
          min={1}
          max={64}
          label={props.parameters.editB}
          engine={1}
        />
      </div>
      <div>
        <Param
          client={props.client}
          param={Parameter.EDIT_A}
          min={1}
          max={64}
          label={props.parameters.editA}
          engine={2}
        />
        <Param
          client={props.client}
          param={Parameter.EDIT_B}
          min={1}
          max={64}
          label={props.parameters.editB}
          engine={2}
        />
      </div>
    </div>
  )
}

export function EffectPanel(props: { client: MidiClient, effectType: EffectType }) {
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