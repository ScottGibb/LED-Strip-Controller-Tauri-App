import { useEffect, useState } from "react";
import { notifyInfo } from "../../services/notifications";
import { NavLink } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
// import { info } from "@tauri-apps/plugin-log";

export function SerialConfigurationPage() {
  const [devices, setDevices] = useState<string[]>([]);
  const [selectedPort, setSelectedPort] = useState<string>("");
  const [selectedBaudRate, setSelectedBaudRate] = useState<number>(9600);

  useEffect(() => {}, []);

  const scanDevices = () => {
    invoke("scan_serial_devices", []).then((scannedDevices) => {
      // info("Scanning for serial devices...");
      setDevices(scannedDevices as string[]);
      notifyInfo(`Found devices: ${(scannedDevices as string[]).join(", ")}`);
    });
  };
  const connectToDevice = () => {
    notifyInfo("Connecting to device...");
    invoke("connect_serial_device", {
      portName: selectedPort,
      baudRate: selectedBaudRate,
    })
      .then(() => {
        notifyInfo("Connected to device!");
      })
      .catch((err) => {
        notifyInfo(`Failed to connect to device: ${err}`);
      });
  };

  const disconnectFromDevice = () => {
    notifyInfo("Disconnecting from device...");
    invoke("disconnect_serial_device", {})
      .then(() => {
        notifyInfo("Disconnected from device!");
      })
      .catch((err) => {
        notifyInfo(`Failed to disconnect from device: ${err}`);
      });
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-4">Serial Configuration</h1>
        <button className="btn btn-primary" onClick={scanDevices}>
          Scan for Devices
        </button>
        <div className="flex flex-col gap-2">
          <select
            className="select select-bordered w-full"
            value={selectedPort}
            onChange={(e) => setSelectedPort(e.target.value)}
          >
            <option value="">Select a device</option>
            {devices.map((device) => (
              <option key={device} value={device}>
                {device}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Baud Rate"
            className="input input-bordered w-full"
            value={selectedBaudRate}
            onChange={(e) => setSelectedBaudRate(Number(e.target.value))}
          />
        </div>
        <div className="flex gap-2 flex-row w-full">
          <button className="btn btn-primary flex-1" onClick={connectToDevice}>
            Connect
          </button>
          <button
            className="btn btn-primary flex-1"
            onClick={disconnectFromDevice}
          >
            Disconnect
          </button>
        </div>
        <div className="flex gap-2 flex-col w-full">
          <button className="btn btn-secondary">Continue</button>
          <NavLink className="btn btn-secondary" to="/">
            Back
          </NavLink>
        </div>
      </div>
    </div>
  );
}
