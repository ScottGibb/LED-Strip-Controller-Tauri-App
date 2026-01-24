export interface DeviceInfo {
  hardwareVersion: string;
  firmwareVersion: string;
  channels: number;
  memory: Memory;
  powerSensor: boolean;
  temperatureSensor: boolean;
  communicator: string;
}

export interface Power {
  voltage: number;
  current: number;
  power: number;
}
export interface Memory {
  totalBytes: number;
}
