/** Settings for the game.  This page is loaded once before a game starts to determine rules and player count. */

import { useEffect } from "react";
import { NavLink } from "react-router-dom";

export function TcpConfigurationPage() {
  useEffect(() => {}, []);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-4">TCP Configuration</h1>
        <input
          type="string"
          placeholder="IP Address"
          className="input input-bordered w-full"
        />
        <input
          type="number"
          placeholder="Port"
          className="input input-bordered w-full"
        />
        <div className="flex gap-2 flex-col">
          <div className="flex gap-2 flex-row">
            <button className="btn btn-primary">Connect</button>
            <button className="btn btn-primary">Disconnect</button>
          </div>
          <button className="btn btn-secondary"> Continue</button>
          <NavLink className="btn btn-secondary" to="/">
            Back
          </NavLink>
          <NavLink className="btn btn-secondary" to="/control/master_control">
            Master Control
          </NavLink>
        </div>
      </div>
    </div>
  );
}
