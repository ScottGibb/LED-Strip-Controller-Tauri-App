use serde::{ser::SerializeStruct, Serialize};
use serialport::SerialPort;

use crate::communicator::{Communicator, CommunicatorError};

#[derive(Debug)]
pub struct SerialCommunicator {
    pub port_name: String,
    pub baud_rate: u32,
    pub port: Option<Box<dyn SerialPort>>,
}

impl Serialize for SerialCommunicator {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut state = serializer.serialize_struct("SerialCommunicator", 2)?;
        state.serialize_field("port_name", &self.port_name)?;
        state.serialize_field("baud_rate", &self.baud_rate)?;
        state.end()
    }
}
impl SerialCommunicator {
    pub fn scan_for_devices() -> Result<Vec<String>, CommunicatorError> {
        let ports = serialport::available_ports()?;
        let port_names = ports.into_iter().map(|p| p.port_name).collect();
        Ok(port_names)
    }
}

impl Communicator for SerialCommunicator {
    async fn disconnect(&mut self) -> Result<(), CommunicatorError> {
        if self.port.is_none() {
            return Err(CommunicatorError::Uninitialized);
        }
        self.port = None; // Serial ports are closed when dropped
        Ok(())
    }

    async fn write(&mut self, data: &[u8]) -> Result<(), CommunicatorError> {
        if let Some(port) = &mut self.port {
            port.write_all(data)?;
            Ok(())
        } else {
            Err(CommunicatorError::Uninitialized)
        }
    }

    async fn connect(&mut self) -> Result<(), CommunicatorError> {
        let port = serialport::new(&self.port_name, self.baud_rate)
            .timeout(std::time::Duration::from_secs(1))
            .open()?;
        self.port = Some(port);
        Ok(())
    }

    async fn is_connected(&mut self) -> bool {
        self.port.is_some()
    }
}
