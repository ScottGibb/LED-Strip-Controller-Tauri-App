#[derive(Debug)]
pub struct PowerSensor {
    pub voltage: f32,
    pub current: f32,
    pub power: f32,
}

#[derive(Debug)]
pub struct TemperatureSensor {
    pub temperature_celsius: f32,
}
