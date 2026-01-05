use crate::commands::{greet, scan_serial_devices};

mod commands;
mod communicator;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, scan_serial_devices])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
