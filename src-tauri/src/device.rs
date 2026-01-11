use crate::{commands::communicator, communicator::Communicator};

pub struct Device {
    pub name: String,
    pub channels: Vec<Channel>,
    pub memory: Option<Memory>,
    pub power_sensor: Option<PowerSensor>,
    pub temperature_sensor: Option<TemperatureSensor>,
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
