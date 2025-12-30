export interface SystemSpecifications {
  hardware_version: string;
  firmware_version: string;
  number_of_channels: number;
  memory_size: number;
}

export interface Power {
  voltage: number;
  current: number;
  power: number;
}
