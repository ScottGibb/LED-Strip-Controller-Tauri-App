pub struct SerialCommunicator {
    pub port_name: String,
    pub baud_rate: u32,
}

impl SerialCommunicator {
    pub fn new(port_name: &str, baud_rate: u32) -> Self {
        SerialCommunicator {
            port_name: port_name.to_string(),
            baud_rate,
        }
    }

    pub fn scan_for_devices() -> Vec<String> {
        // Placeholder implementation
        tokio_serial::available_ports()
            .map(|ports| ports.into_iter().map(|p| p.port_name).collect())
            .unwrap_or_default()
    }
}
