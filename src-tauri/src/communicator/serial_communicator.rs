use crate::communicator::{Communicator, CommunicatorError};

pub struct SerialCommunicator {
    pub port_name: String,
    pub baud_rate: u32,
    port: Option<tokio_serial::SerialStream>,
}

impl SerialCommunicator {
    pub fn new(port_name: &str, baud_rate: u32) -> Self {
        SerialCommunicator {
            port_name: port_name.to_string(),
            baud_rate,
            port: None,
        }
    }

    pub fn scan_for_devices() -> Vec<String> {
        tokio_serial::available_ports()
            .map(|ports| ports.into_iter().map(|p| p.port_name).collect())
            .unwrap_or_default()
    }
}

impl Communicator for SerialCommunicator {
    async fn connect(&mut self) -> Result<(), CommunicatorError> {
        let port =
            tokio_serial::SerialStream::open(&tokio_serial::new(&self.port_name, self.baud_rate))
                .map_err(|_| CommunicatorError::FAILED)?;
        self.port = Some(port);
        Ok(())
    }

    async fn disconnect(&mut self) -> Result<(), CommunicatorError> {
        self.port = None;
        Ok(())
    }

    async fn write(&mut self, data: &[u8]) -> Result<(), CommunicatorError> {
        todo!()
    }
}
