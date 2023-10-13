import { useState, useEffect, useCallback } from 'react'
import { MidiClient } from '../backend/midi'
import { Parameter } from '../backend/dsp_constants'

export function MixSlider(props: { client: MidiClient }) {
  const [mix, setMix] = useState(20);
  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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