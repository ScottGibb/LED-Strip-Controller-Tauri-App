use crate::{
    communicator::CommunicatorType,
    device::{
        channel::Channel,
        error::DeviceError,
        information::DeviceInfo,
        memory::Memory,
        sensors::{PowerSensor, TemperatureSensor},
    },
};

pub mod channel;
pub mod error;
pub mod information;
mod memory;
mod sensors;
pub mod types;

#[derive(Debug)]
pub struct Device {
    pub hardware_version: String,
    pub firmware_version: String,
    pub channels: Vec<Channel>,
    pub memory: Option<Memory>,
    pub power_sensor: Option<PowerSensor>,
    pub temperature_sensor: Option<TemperatureSensor>,
    pub communicator: CommunicatorType,
}

impl Device {
    pub fn new(communicator: CommunicatorType) -> Self {
        // Device {
        //     hardware_version: "TBD".to_string(),
        //     firmware_version: "TBD".to_string(),
        //     channels: Vec::new(),
        //     memory: None,
        //     power_sensor: None,
        //     temperature_sensor: None,
        //     communicator,
        // }

        Device {
            hardware_version: "TBD".to_string(),
            firmware_version: "TBD".to_string(),
            channels: vec![
                Channel::Colour {
                    colour: crate::communications::types::Colour::Red,
                    brightness: 255,
                };
                3
            ],
            memory: Some(Memory { total_bytes: 1024 }),
            power_sensor: Some(PowerSensor {
                voltage: 5.0,
                current: 0.5,
                power: 2.5,
            }),
            temperature_sensor: Some(TemperatureSensor {
                temperature_celsius: 24.0,
            }),
            communicator,
        }
    }
    pub async fn set_channel(
        &mut self,
        channel_index: usize,
        channel: Channel,
    ) -> Result<(), DeviceError> {
        let channel_ref = self
            .channels
            .get_mut(channel_index - 1)
            .ok_or(DeviceError::InvalidChannelIndex)?;

        *channel_ref = channel;

        self.communicator
            .write(&channel_ref.create_message(
                u8::try_from(channel_index).map_err(|_| DeviceError::InvalidChannelIndex)?,
            ))
            .await
            .map_err(DeviceError::CommunicationError)
    }
    pub fn get_channel(&self, channel_index: usize) -> Result<&Channel, DeviceError> {
        self.channels
            .get(channel_index - 1)
            .ok_or(DeviceError::InvalidChannelIndex)
    }

    pub fn get_num_channels(&mut self) -> Result<usize, DeviceError> {
        match self.channels.len() {
            0 => Err(DeviceError::InvalidConfiguration),
            n => Ok(n),
        }
    }

    pub fn get_device_info(&self) -> DeviceInfo {
        DeviceInfo {
            hardware_version: self.hardware_version.clone(),
            firmware_version: self.firmware_version.clone(),
            channels: self.channels.len(),
            memory: self.memory.clone().unwrap_or(Memory { total_bytes: 0 }),
            power_sensor: self.power_sensor.is_some(),
            temperature_sensor: self.temperature_sensor.is_some(),
            communicator: serde_json::to_string(&self.communicator)
                .unwrap_or("UNINITIALISED".to_string()),
        }
    }
}
