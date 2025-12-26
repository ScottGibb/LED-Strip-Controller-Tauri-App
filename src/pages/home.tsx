/** Settings for the game.  This page is loaded once before a game starts to determine rules and player count. */

import { useEffect } from "react";
import { NavLink } from "react-router-dom";

export function HomePage() {
  useEffect(() => {}, []);
  return (
    <div>
      <button className="btn btn-primary">Choose Connection Type</button>
      <div>
        <NavLink className="btn btn-secondary" to="/configuration/serial">
          Serial / USB
        </NavLink>
        <button className="btn btn-secondary"> TCP / WiFi</button>
      </div>
    </div>
  );
}
