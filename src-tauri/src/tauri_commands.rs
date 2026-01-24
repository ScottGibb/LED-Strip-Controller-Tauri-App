pub mod serial {
    use tauri::State;

    use crate::{
        communicator::{
            error::CommunicatorError, serial_communicator::SerialCommunicator, Communicator,
            CommunicatorType,
        },
        device::Device,
        AppState,
    };

    #[tauri::command]
    pub async fn scan_serial_devices() -> Result<Vec<String>, CommunicatorError> {
        SerialCommunicator::scan_for_devices()
    }

    #[tauri::command]
    pub async fn connect_serial_device(
        port_name: &str,
        baud_rate: u32,
        state: State<'_, AppState>,
    ) -> Result<(), CommunicatorError> {
        let mut device = state.device.lock().await;
        if device.is_some() {
            return Err(CommunicatorError::AlreadyConnected);
        }
        let mut comm = SerialCommunicator {
            port_name: port_name.to_string(),
            baud_rate,
            port: None,
        };
        log::info!("Connecting to serial device at {port_name}:{baud_rate}");
        comm.connect().await?;
        log::info!("Connected to serial device at {port_name}:{baud_rate}");
        log::info!("Creating device with serial communicator");
        *device = Some(Device::new(CommunicatorType::Serial(comm)));
        log::info!("Device created and stored in state");
        Ok(())
    }
}

pub mod tcp {
    use std::net::IpAddr;

    use log::info;
    use tauri::State;

    use crate::{
        communicator::{
            error::CommunicatorError, tcp_communicator::TcpCommunicator, Communicator,
            CommunicatorType,
        },
        device::Device,
        AppState,
    };

    #[tauri::command]
    pub async fn connect_tcp_device(
        address: String,
        port_number: u16,
        state: State<'_, AppState>,
    ) -> Result<(), CommunicatorError> {
        let mut device = state.device.lock().await;
        if device.is_some() {
            return Err(CommunicatorError::AlreadyConnected);
        }
        let address: IpAddr = address
            .parse()
            .map_err(|_| CommunicatorError::MalformedAddress)?;
        let mut comm = TcpCommunicator {
            address,
            port_number,
            stream: None,
        };
        info!("Connecting to TCP device at {address}:{port_number}");
        comm.connect().await?;
        *device = Some(Device::new(CommunicatorType::Tcp(comm)));
        Ok(())
    }
}
pub mod communicator {
    use crate::{
        communicator::{error::CommunicatorError, Communicator, CommunicatorType},
        AppState,
    };

    #[tauri::command]
    pub async fn is_connected(state: tauri::State<'_, AppState>) -> Result<bool, String> {
        let mut device = state.device.lock().await;
        let result = match &mut *device {
            Some(device) => match &mut device.communicator {
                CommunicatorType::Serial(comm) => comm.is_connected().await,
                CommunicatorType::Tcp(comm) => comm.is_connected().await,
            },
            None => false,
        };
        Ok(result)
    }
    #[tauri::command]
    pub async fn disconnect(state: tauri::State<'_, AppState>) -> Result<(), CommunicatorError> {
        let mut device = state.device.lock().await;
        match &mut *device {
            Some(device) => match &mut device.communicator {
                CommunicatorType::Serial(comm) => {
                    comm.disconnect().await?;
                }
                CommunicatorType::Tcp(comm) => {
                    comm.disconnect().await?;
                }
            },
            None => {
                return Err(CommunicatorError::Uninitialized);
            }
        }
        *device = None;
        Ok(())
    }
}

pub mod rgb_control {}
pub mod hsv_control {}
pub mod fade_control {}
pub mod device_info {
    use tauri::State;

    use crate::{
        device::{error::DeviceError, information::DeviceInfo, Device},
        AppState,
    };

    #[tauri::command]
    pub async fn get_num_channels(state: State<'_, AppState>) -> Result<usize, DeviceError> {
        let mut device = state.device.lock().await;
        match &mut *device {
            Some(device) => device.get_num_channels(),
            None => Err(DeviceError::InvalidConfiguration),
        }
    }

    #[tauri::command]
    pub async fn get_device_info(state: State<'_, AppState>) -> Result<DeviceInfo, DeviceError> {
        let device = state.device.lock().await;
        match &*device {
            Some(device) => Ok(device.get_device_info()),
            None => Err(DeviceError::InvalidConfiguration),
        }
    }
}
