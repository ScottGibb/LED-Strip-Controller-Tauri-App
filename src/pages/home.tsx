/** Settings for the game.  This page is loaded once before a game starts to determine rules and player count. */

import { useEffect } from "react";
import { NavLink } from "react-router-dom";

export function HomePage() {
  useEffect(() => {}, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Choose your connection type</h1>
      <div className="flex gap-4">
        <NavLink className="btn btn-secondary" to="/configuration/serial">
          Serial / USB
        </NavLink>
        <NavLink className="btn btn-secondary" to="/configuration/tcp">
          TCP / IP
        </NavLink>
      </div>
    </div>
  );
}
