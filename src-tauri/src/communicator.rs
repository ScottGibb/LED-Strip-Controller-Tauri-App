use std::u8;

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

pub enum CommunicatorType {
    Serial(SerialCommunicator),
    Tcp(TcpCommunicator),
}

impl CommunicatorType {
    pub async fn write(&mut self, data: &[u8]) -> Result<(), CommunicatorError> {
        match self {
            CommunicatorType::Serial(comm) => comm.write(data).await,
            CommunicatorType::Tcp(comm) => comm.write(data).await,
        }
    }
}
