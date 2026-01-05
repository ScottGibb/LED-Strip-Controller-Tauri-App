use crate::communicator::serial_communicator::SerialCommunicator;

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
pub fn scan_serial_devices() -> Vec<String> {
    println!("{:?}", SerialCommunicator::scan_for_devices());
    SerialCommunicator::scan_for_devices()
}
