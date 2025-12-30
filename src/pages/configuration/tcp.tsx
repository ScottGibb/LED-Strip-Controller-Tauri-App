/** Settings for the game.  This page is loaded once before a game starts to determine rules and player count. */

import { useEffect } from "react";
import { notifySuspense } from "../../services/notifications";
import { NavLink } from "react-router-dom";

export function TcpConfigurationPage() {
  useEffect(() => {}, []);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="string"
          placeholder="IP Address"
          className="input input-bordered w-full"
        />
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
        <div className="flex gap-2">
          <button
            className="btn btn-primary flex-1"
            onClick={() => {
              notifySuspense("Connecting...");
            }}
          >
            Connect
          </button>
          <NavLink className="btn btn-secondary flex-1" to="/">
            Back
          </NavLink>
          <NavLink
            className="btn btn-secondary flex-1"
            to="/control/master_control"
          >
            Master Control
          </NavLink>
        </div>
      </div>
    </div>
  );
}
