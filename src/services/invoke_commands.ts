import { invoke } from "@tauri-apps/api/core";
import { notifyError, notifySuccess } from "./notifications";

export const disconnectFromDevice = (): void => {
  invoke("disconnect", {})
    .then(() => {
      notifySuccess("Disconnected from device!");
    })
    .catch((err: unknown) => {
      notifyError(`Failed to disconnect from device: ${err}`);
    });
};

export const isConnected = async (): Promise<boolean> => {
  try {
    return await invoke<boolean>("is_connected");
  } catch (err: unknown) {
    notifyError(`Failed to check connection status: ${err}`);
    return false;
  }
};

export const getNumChannels = async (): Promise<number> => {
  try {
    const numChannels = await invoke<number>("get_num_channels");
    return numChannels;
  } catch (err: unknown) {
    notifyError(`Failed to get number of channels: ${err}`);
    return 0;
  }
};
