use crate::commands::{connect_serial_device, scan_serial_devices};

mod commands;
mod communicator;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(tauri_plugin_log::log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_log::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            scan_serial_devices,
            connect_serial_device
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
