import { useEffect, useState } from "react";
import { notifyInfo } from "../../services/notifications";
import { NavLink } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

export function SerialConfigurationPage() {
  const [devices, setDevices] = useState<string[]>([]);

  useEffect(() => {}, []);

  const scanDevices = () => {
    invoke("scan_serial_devices", []).then((scannedDevices) => {
      console.log("Found devices:", scannedDevices);
      setDevices(scannedDevices as string[]);
      notifyInfo(`Found devices: ${(scannedDevices as string[]).join(", ")}`);
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-4">
        <button className="btn btn-primary" onClick={scanDevices}>
          Scan for Devices
        </button>
        <div className="flex flex-col gap-2">
          <select className="select select-bordered w-full">
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
          />
        </div>
        <div className="flex gap-2 flex-col">
          <button className="btn btn-primary">Connect</button>
          <NavLink className="btn btn-secondary" to="/">
            Back
          </NavLink>
        </div>
      </div>
    </div>
  );
}
