/** Settings for the game.  This page is loaded once before a game starts to determine rules and player count. */

import { useEffect } from "react";
import { notifySuccess } from "../services/notifications";

export function SettingsPage() {
  useEffect(() => {}, []);
  return (
    <div>
      <button
        className="btn  btn-secondary"
        onClick={() => notifySuccess("Settings saved!")}
      >
        Save Settings
      </button>
    </div>
  );
}
