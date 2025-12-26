/** Settings for the game.  This page is loaded once before a game starts to determine rules and player count. */

import { useEffect } from "react";
import { notifySuspense } from "../../services/notifications";
import { NavLink } from "react-router-dom";

export function TcpConfigurationPage() {
  useEffect(() => {}, []);
  return (
    <div>
      <div className="flex flex-col gap-2">
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
      </div>
      <div>
        <button
          className="btn btn-primary"
          onClick={() => {
            notifySuspense("Connecting...");
          }}
        >
          Connect
        </button>
        <NavLink className="btn btn-secondary" to="/">
          Back
        </NavLink>
      </div>
    </div>
  );
}
