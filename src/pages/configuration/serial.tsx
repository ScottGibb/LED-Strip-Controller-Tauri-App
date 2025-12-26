/** Settings for the game.  This page is loaded once before a game starts to determine rules and player count. */

import { useEffect } from "react";
import { notifyInfo } from "../../services/notifications";
import { NavLink } from "react-router-dom";

export function SerialConfigurationPage() {
  useEffect(() => {}, []);
  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => {
          notifyInfo("Scanning for devices...");
        }}
      >
        Scan for Devices
      </button>
      <div className="flex flex-col gap-2">
        <select className="select select-bordered w-full">
          <option value="someOption">Some option</option>
          <option value="otherOption">Other option</option>
        </select>
        <input
          type="number"
          placeholder="Baud Rate"
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <button className="btn btn-primary">Connect</button>
        <NavLink className="btn btn-secondary" to="/">
          Back
        </NavLink>
      </div>
    </div>
  );
}
