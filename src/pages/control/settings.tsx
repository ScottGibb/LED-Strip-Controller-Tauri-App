/** Settings for the game.  This page is loaded once before a game starts to determine rules and player count. */

import { useEffect } from "react";
import { DefaultConfiguration } from "./default_control";

export function SettingsPage() {
  useEffect(() => {}, []);
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
  return (
    <div className="flex flex-col items-center gap-2">
      <h1>System Specification</h1>
      <p>Hardware Version:</p>
      <p>Firmware Version:</p>
      <p>Port /IP Address:</p>
      <p>Number of Channels:</p>
      <div>
        <p>Power Sensor:</p>
        <div>
          <p>Voltage:</p>
          <p>Current:</p>
          <p>Power:</p>
        </div>
      </div>
      <div>
        <p>Temperature Sensor:</p>
        <div>
          <p>Temperature:</p>
        </div>
      </div>
      <p>Memory:</p>
    </div>
  );
}
