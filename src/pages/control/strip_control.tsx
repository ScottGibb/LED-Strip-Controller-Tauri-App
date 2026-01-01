/** Settings for the game.  This page is loaded once before a game starts to determine rules and player count. */

import { useEffect } from "react";
import { DefaultConfiguration } from "./default_control";

export function StripControlPage() {
  useEffect(() => {}, []);
  return (
    <div>
      <DefaultConfiguration
        element={
          <div>
            <h1> Hello</h1>
          </div>
        }
      />
    </div>
  );
}
