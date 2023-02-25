import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api'

function App() {
  const [count, setCount] = useState(0)

  const openMidi = () => {
    console.log("opening midi")
    invoke('open_midi_connection', { inputPortIdx: 1, outputPortIdx: 1 });
  };

  const sendProgramChange = () => {
    console.log("sending program change")
    invoke('send_program_change', { value: 1 });
  };

  return (
    <div className="App">
      <h1>DSP1000P</h1>
      <div className="card">
        <button onClick={() => openMidi()}>
          openMidi
        </button>

        <button onClick={() => sendProgramChange()}>
          send rogram change
        </button>
        <p>Click to open midi</p>
      </div>
      <p className="read-the-docs">
        Yoo it works
      </p>
    </div>
  )
}

export default App
