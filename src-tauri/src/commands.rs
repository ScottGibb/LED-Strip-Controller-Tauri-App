use crate::communicator::{serial_communicator::SerialCommunicator, Communicator};

#[tauri::command]
pub async fn scan_serial_devices() -> Vec<String> {
    let ports = SerialCommunicator::scan_for_devices();
    log::info!("Found serial ports: {:?}", ports);
    ports
}

#[tauri::command]
pub async fn connect_serial_device(port_name: &str, baud_rate: u32) -> Result<(), String> {
    let mut comm = SerialCommunicator::new(port_name, baud_rate);
    comm.connect()
        .await
        .map_err(|e| format!("Failed to connect: {:?}", e))?;
    Ok(())
}

#[tauri::command]
pub async fn disconnect_serial_device() -> Result<(), String> {
    Ok(()) // Placeholder for disconnect logic
}
