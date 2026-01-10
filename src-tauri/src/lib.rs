use tauri::async_runtime::Mutex;

use crate::{
    commands::{
        communicator::{disconnect, is_connected},
        serial::{connect_serial_device, scan_serial_devices},
        tcp::connect_tcp_device,
    },
    communicator::CommunicatorType,
};

mod commands;
mod communicator;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

pub struct AppState {
    pub communicator: Mutex<Option<CommunicatorType>>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let app_state = AppState {
        communicator: Mutex::new(None),
    };
    tauri::Builder::default()
        .manage(app_state)
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(tauri_plugin_log::log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            scan_serial_devices,
            connect_serial_device,
            connect_tcp_device,
            disconnect,
            is_connected
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
