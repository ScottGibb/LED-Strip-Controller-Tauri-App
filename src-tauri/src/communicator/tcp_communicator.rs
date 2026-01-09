use crate::communicator::{Communicator, CommunicatorError};

pub struct TcpCommunicator {}
impl Communicator for TcpCommunicator {
    async fn connect(&mut self) -> Result<(), CommunicatorError> {
        Ok(())
    }

    async fn disconnect(&mut self) -> Result<(), CommunicatorError> {
        Ok(())
    }

    async fn write(&mut self, data: &[u8]) -> Result<(), CommunicatorError> {
        todo!()
    }
}
