/** Settings for the game.  This page is loaded once before a game starts to determine rules and player count. */

import { useEffect } from "react";
import { ControlMenuTemplate } from "./control_menu_template";

export function StripControlPage() {
  useEffect(() => {}, []);
  return (
    <div>
      <ControlMenuTemplate
        element={
          <div>
            <h1> Hello</h1>
          </div>
        }
      />
    </div>
  );
}
