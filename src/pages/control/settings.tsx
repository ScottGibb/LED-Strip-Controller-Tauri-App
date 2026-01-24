/** Settings for the game.  This page is loaded once before a game starts to determine rules and player count. */

import { useEffect, useState } from "react";
import { DefaultConfiguration } from "./default_control";
import { DeviceInfo } from "../../types/system_specifications";
import { getSystemSpecifications } from "../../services/invoke_commands";
import { notify } from "../../services/notifications";

export function SettingsPage() {
  return (
    <DefaultConfiguration
      element={
        <div className="flex col gap-4 mb-4">
          <div className="flex flex-col gap-2">
            <SystemSpecification />
          </div>
          <div className="flex flex-col gap-2">
            <SerialLog />
          </div>
        </div>
      }
    ></DefaultConfiguration>
  );
}

function SerialLog() {
  return (
    <div className="flex flex-col items-center gap-2">
      <h1>Serial Log</h1>
      <textarea
        className="textarea textarea-bordered w-full h-64"
        placeholder="Serial log will appear here..."
      ></textarea>
    </div>
  );
}

function SystemSpecification() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      const deviceConfig = await getSystemSpecifications();
      notify(`Fetched device specifications: ${JSON.stringify(deviceConfig)}`);
      setDeviceInfo(deviceConfig);
    };
    fetchDeviceInfo();
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <h1>System Specification</h1>
      <p>
        Hardware Version: {deviceInfo?.hardwareVersion ?? "Failed to fetch"}
      </p>
      <p>
        Firmware Version: {deviceInfo?.firmwareVersion ?? "Failed to fetch"}
      </p>
      <p>Number of Channels: {deviceInfo?.channels ?? "Failed to fetch"}</p>
      <p>
        Memory (bytes): {deviceInfo?.memory?.totalBytes ?? "Failed to fetch"}
      </p>
      <div>
        <p>Communicator Type:</p>
        <p>{deviceInfo?.communicator ?? "Failed to fetch"}</p>
      </div>
      <div>
        <p>
          Power Sensor:{" "}
          {deviceInfo
            ? deviceInfo.powerSensor
              ? "Yes"
              : "No"
            : "Failed to fetch"}
        </p>
        {deviceInfo?.powerSensor && (
          <div>
            <p>Voltage:</p>
            <p>Current:</p>
            <p>Power:</p>
          </div>
        )}
      </div>
      <div>
        <p>
          Temperature Sensor:{" "}
          {deviceInfo
            ? deviceInfo.temperatureSensor
              ? "Yes"
              : "No"
            : "Failed to fetch"}
        </p>
        {deviceInfo?.temperatureSensor && (
          <div>
            <p>Temperature:</p>
          </div>
        )}
      </div>
    </div>
  );
}
