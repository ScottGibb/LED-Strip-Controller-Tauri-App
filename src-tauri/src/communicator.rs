use std::fmt::Display;

use crate::communicator::error::CommunicatorError;
use crate::communicator::{
    serial_communicator::SerialCommunicator, tcp_communicator::TcpCommunicator,
};

pub mod error;
pub mod serial_communicator;
pub mod tcp_communicator;

pub trait Communicator {
    async fn connect(&mut self) -> Result<(), CommunicatorError>;
    async fn is_connected(&mut self) -> bool;
    async fn disconnect(&mut self) -> Result<(), CommunicatorError>;
    async fn write(&mut self, data: &[u8]) -> Result<(), CommunicatorError>;
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub enum CommunicatorType {
    Serial(SerialCommunicator),
    Tcp(TcpCommunicator),
}

impl Display for CommunicatorType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            CommunicatorType::Serial(serial) => {
                write!(f, "Serial ({}, {})", serial.port_name, serial.baud_rate)
            }
            CommunicatorType::Tcp(tcp) => write!(f, "TCP ({}, {})", tcp.address, tcp.port_number),
        }
    }
}

impl CommunicatorType {
    pub async fn write(&mut self, data: &[u8]) -> Result<(), CommunicatorError> {
        match self {
            CommunicatorType::Serial(comm) => comm.write(data).await,
            CommunicatorType::Tcp(comm) => comm.write(data).await,
        }
    }
}
