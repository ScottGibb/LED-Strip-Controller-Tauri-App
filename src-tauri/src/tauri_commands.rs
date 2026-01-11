pub mod serial {
    use tauri::State;

    use crate::{
        communicator::{
            error::CommunicatorError, serial_communicator::SerialCommunicator, Communicator,
            CommunicatorType,
        },
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
        let mut communicator = state.communicator.lock().await;
        if communicator.is_some() {
            return Err(CommunicatorError::AlreadyConnected);
        }
        let mut comm = SerialCommunicator {
            port_name: port_name.to_string(),
            baud_rate,
            port: None,
        };
        comm.connect().await?;
        *communicator = Some(CommunicatorType::Serial(comm));
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
        AppState,
    };

    #[tauri::command]
    pub async fn connect_tcp_device(
        address: String,
        port_number: u16,
        state: State<'_, AppState>,
    ) -> Result<(), CommunicatorError> {
        let mut communicator = state.communicator.lock().await;
        if communicator.is_some() {
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
        info!("Connecting to TCP device at {}:{}", address, port_number);
        comm.connect().await?;
        *communicator = Some(CommunicatorType::Tcp(comm));
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
        let communicator = &mut *state.communicator.lock().await;
        let result = match communicator {
            Some(communicator) => match communicator {
                CommunicatorType::Serial(comm) => comm.is_connected().await,
                CommunicatorType::Tcp(comm) => comm.is_connected().await,
            },
            None => false,
        };
        Ok(result)
    }
    #[tauri::command]
    pub async fn disconnect(state: tauri::State<'_, AppState>) -> Result<(), CommunicatorError> {
        let communicator = &mut *state.communicator.lock().await;
        match communicator {
            Some(communicator) => match communicator {
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
        *communicator = None;
        Ok(())
    }
}
