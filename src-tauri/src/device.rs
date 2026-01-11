use crate::communicator::{self, Communicator};

pub struct Device {
    pub name: String,
    pub channels: Vec<Channel>,
    pub memory: Option<Memory>,
    pub power_sensor: Option<PowerSensor>,
    pub temperature_sensor: Option<TemperatureSensor>,
}

pub enum DeviceError {
    CommunicationError,
    InvalidConfiguration,
}

impl Device {
    pub fn new(name: &str, _communicator: &mut impl Communicator) -> Self {
        Device {
            name: name.to_string(),
            channels: Vec::new(),
            memory: None,
            power_sensor: None,
            temperature_sensor: None,
        }
    }
    pub fn set_channel(
        &mut self,
        channel_index: usize,
        channel: Channel,
    ) -> Result<(), DeviceError> {
        if channel_index >= self.channels.len() {
            return Err(DeviceError::InvalidConfiguration);
        }
        self.channels[channel_index] = channel;
        // Use Communicator to send updated channel data to the device
        Ok(())
    }
    pub fn update_channels(&mut self, channels: Vec<Channel>) {
        self.channels = channels;
    }
}

pub struct PowerSensor {
    pub voltage: f32,
    pub current: f32,
    pub power: f32,
}

pub enum Channel {
    RGB(u8, u8, u8),
    HSV(u16, u8, u8),
}
pub struct TemperatureSensor {
    pub temperature_celsius: f32,
}

pub struct Memory {
    pub total_bytes: usize,
}

pub struct SerialDevice {
    pub port_name: String,
    pub baud_rate: u32,
    pub configuration: Device,
}

pub struct NetworkDevice {
    pub ip_address: String,
    pub port: u16,
    pub configuration: Device,
}
