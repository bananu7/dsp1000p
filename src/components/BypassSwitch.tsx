import { useState, useEffect, useCallback } from 'react'
import { MidiClient } from '../backend/midi'
import { Parameter } from '../backend/dsp_constants'

export function BypassSwitch(props: { client: MidiClient }) {
  const [bypass, setBypass] = useState(false);
  const onChangeBypass = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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