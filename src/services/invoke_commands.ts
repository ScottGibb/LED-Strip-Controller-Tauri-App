import { invoke } from "@tauri-apps/api/core";
import { info, warn } from "@tauri-apps/plugin-log";
import { toast } from "react-toastify";
import { notifyError, notifySuccess } from "./notifications";
import { HSV, RGB } from "../types/colours";
import { Colour, Fade, FadeType } from "../types/modes";
import { DeviceInfo } from "../types/system_specifications";

type ApplyModeParams = {
  selectedFadeType: FadeType;
  fadeTime: number;
  brightness: number;
  selectedColour: Colour;
  selectedChannels: number[];
  selectedRGB: RGB;
  selectedHSV: HSV;
};

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

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

export const getSystemSpecifications = async (): Promise<DeviceInfo | null> => {
  try {
    const specs = await invoke<DeviceInfo>("get_device_info");
    return specs;
  } catch (err: unknown) {
    notifyError(`Failed to get system specifications: ${err}`);
    return null;
  }
};

export const applySelectedMode = async ({
  selectedFadeType,
  fadeTime,
  brightness,
  selectedColour,
  selectedChannels,
  selectedRGB,
  selectedHSV,
}: ApplyModeParams): Promise<void> => {
  info(
    `Master Control - Selected Mode: ${JSON.stringify({
      selectedFadeType,
      fadeTime,
      selectedColour,
      selectedChannels,
      selectedRGB,
      selectedHSV,
    })}`,
  );

  if (selectedChannels.length === 0) {
    toast.warn("Please select at least one channel to apply the mode.");
    return;
  }

  try {
    switch (selectedFadeType) {
      case FadeType.RgbControl:
        toast.info(
          `Applying RGB Control mode with RGB: ${JSON.stringify(selectedRGB)} on channels ${selectedChannels.join(", ")}`,
        );
        await invoke("set_rgb_mode", {
          channelIndexes: selectedChannels,
          colour: {
            red: selectedRGB.r,
            green: selectedRGB.g,
            blue: selectedRGB.b,
          },
        });
        return;

      case FadeType.HueControl:
        toast.info(
          `Applying Hue Control mode with HSV: ${JSON.stringify(selectedHSV)} on channels ${selectedChannels.join(", ")}`,
        );
        await invoke("set_hsv_mode", {
          channelIndexes: selectedChannels,
          colour: {
            hue: selectedHSV.h,
            saturation: selectedHSV.s,
            brightness: selectedHSV.v,
          },
        });
        return;

      case FadeType.None:
        toast.info(
          `Applying None mode (instant change) with Colour: ${selectedColour} on channels ${selectedChannels.join(", ")}`,
        );
        await invoke("set_constant_colour_mode", {
          channelIndexes: selectedChannels,
          colour: selectedColour,
          brightness,
        });
        return;

      default: {
        const fade: Fade = {
          fadeType: selectedFadeType,
          colour: selectedColour,
          brightness,
          periodMs: fadeTime,
        };

        toast.info(
          `Applying ${selectedFadeType} mode with Colour: ${selectedColour} and Brightness: ${brightness}% on channels ${selectedChannels.join(", ")}`,
        );
        await invoke("set_fade_mode", {
          channelIndexes: selectedChannels,
          fade,
        });
      }
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);

    switch (selectedFadeType) {
      case FadeType.RgbControl:
        warn(`Error invoking set_rgb_mode: ${errorMessage}`);
        toast.error(`Failed to apply RGB Control mode: ${errorMessage}`);
        return;

      case FadeType.HueControl:
        warn(`Error invoking set_hsv_mode: ${errorMessage}`);
        toast.error(`Failed to apply Hue Control mode: ${errorMessage}`);
        return;

      case FadeType.None:
        warn(`Error invoking set_constant_colour_mode: ${errorMessage}`);
        toast.error(`Failed to apply None mode: ${errorMessage}`);
        return;

      default:
        warn(`Error invoking set_fade_mode: ${errorMessage}`);
        toast.error(`Failed to apply mode: ${errorMessage}`);
    }
  }
};
