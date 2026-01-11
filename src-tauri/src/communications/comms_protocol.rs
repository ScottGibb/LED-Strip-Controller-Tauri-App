use super::types::{Channel, Colour, ControlCommandId, FadeType, TX_MSG_SIZE};

pub fn create_constant_colour_message(channel: Channel, colour: Colour, brightness: u8) -> Vec<u8> {
    let mut bytes = vec![
        u8::from(ControlCommandId::LedChange),
        u8::from(channel),
        u8::from(FadeType::FadeNone),
        u8::from(colour),
        brightness,
    ];
    add_padding(bytes)
}

pub fn create_fade_message(
    channel: Channel,
    fade_type: FadeType,
    colour: Colour,
    brightness: u8,
    period: u32,
) -> Vec<u8> {
    let mut bytes = vec![
        u8::from(ControlCommandId::LedChange),
        u8::from(channel),
        u8::from(fade_type),
        u8::from(colour),
        brightness,
    ];
    // Add period as 4 bytes in big-endian format
    bytes.extend_from_slice(&period.to_be_bytes());
    add_padding(bytes)
}

pub fn create_rgb_message(channel: Channel, red: u8, green: u8, blue: u8) -> Vec<u8> {
    let bytes = vec![
        u8::from(ControlCommandId::LedChange),
        u8::from(channel),
        u8::from(FadeType::FadeRgbCtrl),
        red,
        green,
        blue,
    ];
    add_padding(bytes)
}

pub fn create_hsb_message(channel: Channel, hue: u16, saturation: u8, brightness: u8) -> Vec<u8> {
    let mut bytes = vec![
        u8::from(ControlCommandId::LedChange),
        u8::from(channel),
        u8::from(FadeType::FadeHueCtrl),
    ];
    // Add hue as 2 bytes in big-endian format
    bytes.extend_from_slice(&hue.to_be_bytes());
    bytes.push(saturation);
    bytes.push(brightness);
    add_padding(bytes)
}

fn add_padding(mut bytes: Vec<u8>) -> Vec<u8> {
    let padding_len = TX_MSG_SIZE.saturating_sub(bytes.len());
    if padding_len > 0 {
        bytes.extend(vec![0; padding_len]);
    }
    bytes
}
