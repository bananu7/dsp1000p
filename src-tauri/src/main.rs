#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]


use std::error::Error;

use midir::MidiOutput;
use midir::MidiOutputPort;

use std::sync::{Mutex};
use midir::{MidiInputConnection, MidiOutputConnection};
use tauri::{Window, Wry};
use serde::{Serialize};

// midi stuff

#[derive(Default)]
pub struct MidiState {
  pub input: Mutex<Option<MidiInputConnection<()>>>,
  pub output: Mutex<Option<MidiOutputConnection>>,
}

#[derive(Clone, Serialize)]
struct MidiMessage {
  message: Vec<u8>
}

fn create_output_connection(output_port_idx: usize)
  -> Result<MidiOutputConnection, Box<dyn Error>>
{
  let midi_out = MidiOutput::new("My Test Output")?;
    
  // Get an output port (read from console if multiple are available)
  let out_ports = midi_out.ports();
  let out_port: &MidiOutputPort = match out_ports.len() {
      0 => return Err("no output port found".into()),
      1 => {
          println!("Choosing the only available output port: {}", midi_out.port_name(&out_ports[0]).unwrap());
          &out_ports[0]
      },
      n => {
          /*println!("\nAvailable output ports:");
          for (i, p) in out_ports.iter().enumerate() {
              println!("{}: {}", i, midi_out.port_name(p).unwrap());
          }
          print!("Please select output port: ");
          stdout().flush()?;
          let mut input = String::new();
          stdin().read_line(&mut input)?;
          out_ports.get(input.trim().parse::<usize>()?)
                   .ok_or("invalid output port selected")?*/
          if output_port_idx < n {
            println!("\nChoosing the user-selected port: {}", output_port_idx);
            &out_ports[output_port_idx]
          } else {
            println!("\nUser selected port {} but only {} present", output_port_idx, n);
            return Err("chosen output port index not present".into())
          }

      }
  };

  println!("\nOpening connection");
  let conn_out = midi_out.connect(out_port, "midir-test")?;
  println!("Connection open. Listen!");

  Ok(conn_out)
}

fn send_program_change_command(conn_out: &mut MidiOutputConnection, value: u8) {
  const PROGRAM_CHANGE_CHANNEL1: u8 = 0xC1;
  // We're ignoring errors in here
  let _ = conn_out.send(&[PROGRAM_CHANGE_CHANNEL1, value]);
}

fn send_control_change_command(conn_out: &mut MidiOutputConnection, param: u8, value: u8) {
  const CC_CHANNEL0: u8 = 0xB0;
  // We're ignoring errors in here
  let _ = conn_out.send(&[CC_CHANNEL0, param, value]);
}

#[tauri::command]
fn open_midi_connection(
  midi_state: tauri::State<'_, MidiState>,
  _window: Window<Wry>,
  output_port_idx: usize,
) {
  println!("Message from Rust");
  let conn_out = create_output_connection(output_port_idx).unwrap();
  *midi_state.output.lock().unwrap() = Some(conn_out);
  
  //let handle = Arc::new(window).clone();
  //handle.emit_all("midi_message",  MidiMessage { message: message.to_vec() });
  //handle.emit_all("midi_message",  MidiMessage { message: vec!(1,2,3) });
}

#[tauri::command]
fn send_program_change(midi_state: tauri::State<'_, MidiState>, value: u8) {
  let maybe_conn_out = &mut *midi_state.output.lock().unwrap();
  match maybe_conn_out {
    Some(conn_out) => {
      println!("Sending program change to {}", value);
      send_program_change_command(conn_out, value)
    },
    None => ()
  }
}

#[tauri::command]
fn send_control_change(midi_state: tauri::State<'_, MidiState>, param: u8, value: u8) {
  let maybe_conn_out = &mut *midi_state.output.lock().unwrap();
  match maybe_conn_out {
    Some(conn_out) => {
      println!("Sending cc of param {} value {}", param, value);
      send_control_change_command(conn_out, param, value)
    },
    None => ()
  }
}

// main
fn main() {
  tauri::Builder::default()
    .manage(MidiState { ..Default::default() })
    .invoke_handler(tauri::generate_handler![open_midi_connection, send_program_change, send_control_change])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
