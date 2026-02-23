use std::{
    io::Write,
    net::{IpAddr, TcpStream},
    time::Duration,
};

use serde::{ser::SerializeStruct, Serialize};

use crate::communicator::{Communicator, CommunicatorError};

#[derive(Debug)]
pub struct TcpCommunicator {
    pub address: IpAddr,
    pub port_number: u16,
    pub stream: Option<std::net::TcpStream>,
}

impl Serialize for TcpCommunicator {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut state = serializer.serialize_struct("TcpCommunicator", 2)?;
        state.serialize_field("address", &self.address.to_string())?;
        state.serialize_field("port_number", &self.port_number)?;
        state.end()
    }
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
        if let Some(stream) = &mut self.stream {
            stream.write_all(data)?;
            Ok(())
        } else {
            Err(CommunicatorError::Uninitialized)
        }
    }

    async fn is_connected(&mut self) -> bool {
        self.stream.is_some()
    }
}
