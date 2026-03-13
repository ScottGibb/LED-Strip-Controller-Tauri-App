use crate::{
    communications::{
        comms_protocol::{
            create_constant_colour_message, create_fade_message, create_hsb_message,
            create_rgb_message,
        },
        types::{Colour, FadeType},
    },
    device::types::{Fade, Hsv, Rgb},
};

#[derive(Debug, Clone)]
pub enum Channel {
    Colour { colour: Colour, brightness: u8 },
    Rgb(Rgb),
    Hsb(Hsv),
    Fade(Fade),
}
impl Channel {
    pub fn create_message(&self, channel: u8) -> Vec<u8> {
        match self {
            Channel::Colour { colour, brightness } => {
                create_constant_colour_message(channel, colour.clone(), *brightness)
            }
            Channel::Rgb(rgb) => create_rgb_message(channel, rgb.red, rgb.green, rgb.blue),
            Channel::Hsb(hsv) => {
                create_hsb_message(channel, hsv.hue, hsv.saturation, hsv.brightness)
            }
            Channel::Fade(Fade {
                fade_type,
                colour,
                brightness,
                period_ms,
            }) => create_fade_message(
                channel,
                fade_type.clone(),
                colour.clone(),
                *brightness,
                *period_ms,
            ),
        }
    }
}
