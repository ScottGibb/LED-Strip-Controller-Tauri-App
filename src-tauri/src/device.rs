pub struct Device {
    pub name: String,
    pub num_channels: usize,
    pub memory_size: usize,
    pub power_sensor_enabled: bool,
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
