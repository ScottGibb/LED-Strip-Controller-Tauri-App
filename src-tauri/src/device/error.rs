use crate::communicator::error::CommunicatorError;

#[derive(Debug, serde::Serialize)]
pub enum DeviceError {
    InvalidConfiguration,
    InvalidChannelIndex,
    CommunicationError(CommunicatorError),
    SerializationError,
}
