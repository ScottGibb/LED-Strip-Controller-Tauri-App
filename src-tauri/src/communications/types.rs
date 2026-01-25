// Buffer sizes for communication messages
// pub const RX_MSG_CNT: usize = 14;
pub const TX_MSG_SIZE: usize = 10;

#[repr(u8)]
#[derive(Clone, Debug, serde::Serialize)]
pub enum Colour {
    Red = 0,
    Green = 1,
    Blue = 2,
    White = 3,
    Rose = 4,
    Magenta = 5,
    Violet = 6,
    Azure = 7,
    Cyan = 8,
    Aquamarine = 9,
    Chartreuse = 10,
    Yellow = 11,
    Orange = 12,
}

impl From<Colour> for u8 {
    fn from(colour: Colour) -> Self {
        colour as u8
    }
}

#[repr(u8)]
#[derive(Clone, Debug, serde::Serialize)]
pub enum FadeType {
    None = 0,
    Sine = 1,
    Square = 2,
    Triangle = 3,
    Sawtooth = 4,
    ColourChange = 5,
    RgbCtrl = 6,
    HueCtrl = 7,
}
impl From<FadeType> for u8 {
    fn from(fade_type: FadeType) -> Self {
        fade_type as u8
    }
}

#[repr(u8)]
pub enum TxMsgId {
    LedUpdate = 0,
    PwrUpdate = 1,
}

impl From<TxMsgId> for u8 {
    fn from(msg_id: TxMsgId) -> Self {
        msg_id as u8
    }
}

#[repr(u8)]
pub enum ControlCommandId {
    LedChange = 0,
}

impl From<ControlCommandId> for u8 {
    fn from(cmd_id: ControlCommandId) -> Self {
        cmd_id as u8
    }
}
