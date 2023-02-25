import { listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api'

export class MidiClient {
  sendProgramChange(programId: number) {
    console.log("sending program change", programId)
    invoke('send_program_change', { value: programId });
  };

  sendCC(param: number, value: number) {
    console.log("sending cc", param, value)
    invoke('send_control_change', { param, value });
  }
}

export async function connectMidi(): Promise<MidiClient> {
  console.log("opening midi");
  const result = await invoke('open_midi_connection', { outputPortIdx: 1 });
  console.log("midi opened");

  return new MidiClient();
}
