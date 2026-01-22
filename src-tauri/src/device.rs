use crate::{
    communications::{
        comms_protocol::{
            create_constant_colour_message, create_fade_message, create_hsb_message,
            create_rgb_message,
        },
        types::{Colour, FadeType},
    },
    communicator::CommunicatorType,
};

pub struct Device {
    pub name: String,
    pub channels: Vec<Channel>,
    pub memory: Option<Memory>,
    pub power_sensor: Option<PowerSensor>,
    pub temperature_sensor: Option<TemperatureSensor>,
    pub communicator: CommunicatorType,
}

pub enum DeviceError {
    CommunicationError,
    InvalidConfiguration,
}

impl Device {
    pub fn new(communicator: CommunicatorType) -> Self {
        Device {
            name: String::new(),
            channels: Vec::new(),
            memory: None,
            power_sensor: None,
            temperature_sensor: None,
            communicator,
        }
    }
    pub async fn set_channel(
        &mut self,
        channel_index: usize,
        channel: Channel,
    ) -> Result<(), DeviceError> {
        if channel_index < self.channels.len() {
            self.channels[channel_index] = channel;
            self.communicator
                .write(&self.channels[channel_index].create_message(channel_index as u8))
                .await
                .map_err(|_| DeviceError::CommunicationError)?;
            Ok(())
        } else {
            Err(DeviceError::InvalidConfiguration)
        }
    }
    pub async fn get_channel(&self, channel_index: usize) -> Result<&Channel, DeviceError> {
        if channel_index < self.channels.len() {
            Ok(&self.channels[channel_index])
        } else {
            Err(DeviceError::InvalidConfiguration)
        }
    }
}
pub struct PowerSensor {
    pub voltage: f32,
    pub current: f32,
    pub power: f32,
}

pub enum Channel {
    Colour {
        colour: Colour,
        brightness: u8,
    },
    Rgb {
        red: u8,
        green: u8,
        blue: u8,
    },
    Hsb {
        hue: u16,
        saturation: u8,
        brightness: u8,
    },
    Fade {
        fade_type: FadeType,
        colour: Colour,
        brightness: u8,
        period_ms: u32,
    },
}

impl Channel {
    fn create_message(&self, channel: u8) -> Vec<u8> {
        match self {
            Channel::Colour { colour, brightness } => {
                create_constant_colour_message(channel, colour.clone(), *brightness)
            }
            Channel::Rgb { red, green, blue } => create_rgb_message(channel, *red, *green, *blue),
            Channel::Hsb {
                hue,
                saturation,
                brightness,
            } => create_hsb_message(channel, *hue, *saturation, *brightness),
            Channel::Fade {
                fade_type,
                colour,
                brightness,
                period_ms,
            } => create_fade_message(
                channel,
                fade_type.clone(),
                colour.clone(),
                *brightness,
                *period_ms,
            ),
        }
    }
}

pub struct TemperatureSensor {
    pub temperature_celsius: f32,
}

pub struct Memory {
    pub total_bytes: usize,
}
