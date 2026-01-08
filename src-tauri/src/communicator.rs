use std::u8;

pub mod serial_communicator;

#[derive(Debug)]
pub enum CommunicatorError {
    FAILED,
}
pub trait Communicator {
    async fn connect(&mut self) -> Result<(), CommunicatorError>;
    async fn disconnect(&mut self) -> Result<(), CommunicatorError>;
    async fn write(&mut self, data: &[u8]) -> Result<(), CommunicatorError>;
}
