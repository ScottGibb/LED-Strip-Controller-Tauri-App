use std::io;

use serde::Serialize;

#[derive(Debug)]
pub enum CommunicatorError {
    Uninitialized,
    AlreadyConnected,
    SerialError(serialport::Error),
    IoError(io::Error),
}

impl Serialize for CommunicatorError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        match self {
            CommunicatorError::Uninitialized => serializer.serialize_str("Uninitialized"),
            CommunicatorError::AlreadyConnected => serializer.serialize_str("AlreadyConnected"),
            CommunicatorError::SerialError(e) => serializer.serialize_str(&e.to_string()),
            CommunicatorError::IoError(e) => serializer.serialize_str(&e.to_string()),
        }
    }
}

impl From<serialport::Error> for CommunicatorError {
    fn from(err: serialport::Error) -> Self {
        CommunicatorError::SerialError(err)
    }
}

impl From<io::Error> for CommunicatorError {
    fn from(err: io::Error) -> Self {
        CommunicatorError::IoError(err)
    }
}
