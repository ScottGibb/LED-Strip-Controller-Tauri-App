use crate::communications::{
    comms_protocol::{
        create_constant_colour_message, create_fade_message, create_hsb_message, create_rgb_message,
    },
    types::{Colour, FadeType},
};

#[derive(Debug)]
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
    pub fn create_message(&self, channel: u8) -> Vec<u8> {
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
