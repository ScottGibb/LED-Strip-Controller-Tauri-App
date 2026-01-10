use std::{
    net::{IpAddr, TcpStream},
    time::Duration,
};

use crate::communicator::{Communicator, CommunicatorError};

pub struct TcpCommunicator {
    pub address: IpAddr,
    pub port_number: u16,
    pub stream: Option<std::net::TcpStream>,
}

impl Communicator for TcpCommunicator {
    async fn connect(&mut self) -> Result<(), CommunicatorError> {
        let addr = std::net::SocketAddr::new(self.address, self.port_number);
        let stream = TcpStream::connect_timeout(&addr, Duration::from_secs(1))?;
        self.stream = Some(stream);
        Ok(())
    }

    async fn disconnect(&mut self) -> Result<(), CommunicatorError> {
        if self.stream.is_none() {
            return Err(CommunicatorError::Uninitialized);
        }
        self.stream = None; // TcpStreams are closed when dropped
        Ok(())
    }

    async fn write(&mut self, data: &[u8]) -> Result<(), CommunicatorError> {
        todo!()
    }

    async fn is_connected(&mut self) -> bool {
        self.stream.is_some()
    }
}
