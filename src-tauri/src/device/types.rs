use crate::communications::types::{Colour, FadeType};

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Rgb {
    pub red: u8,
    pub green: u8,
    pub blue: u8,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Hsv {
    pub hue: u16,
    pub saturation: u8,
    pub brightness: u8,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Fade {
    pub fade_type: FadeType,
    pub colour: Colour,
    pub brightness: u8,
    pub period_ms: u32,
}
