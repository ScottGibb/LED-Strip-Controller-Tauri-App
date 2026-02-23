use crate::device::memory::Memory;

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DeviceInfo {
    pub hardware_version: String,
    pub firmware_version: String,
    pub channels: usize,
    pub memory: Memory,
    pub power_sensor: bool,
    pub temperature_sensor: bool,
    pub communicator: String,
}
