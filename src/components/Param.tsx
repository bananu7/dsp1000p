import { useState, useEffect, useCallback } from 'react'
import { MidiClient } from '../backend/midi'
import { Parameter } from '../backend/dsp_constants'

type ParamProps = {
  client: MidiClient,
  param: number,
  min: number,
  max: number,
  label: string,
  engine?: number,
}
export function Param(props: ParamProps) {
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
