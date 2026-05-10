/** Settings for the game.  This page is loaded once before a game starts to determine rules and player count. */

import { useEffect, useState } from "react";
import { ControlMenuTemplate } from "../control_menu_template";
import { getNumChannels } from "../../../services/invoke_commands";
import { ChannelControl } from "./channel_control";

export function StripControlPage() {
  const [numChannels, setNumChannels] = useState<number>(0);

  useEffect(() => {
    const fetchChannels = async () => {
      const count = await getNumChannels();
      setNumChannels(count);
    };
    fetchChannels();
  }, []);

  function ChannelsSelect() {
    return Array.from({ length: numChannels }, (_, i) => i + 1).map(
      (channel) => (
        <div key={channel}>
          <ChannelControl />
        </div>
      ),
    );
  }
  return (
    <div>
      <ControlMenuTemplate
        element={numChannels > 0 ? <ChannelsSelect /> : <ChannelsErrorSelect />}
      />
    </div>
  );
}

function ChannelsErrorSelect() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Failed to fetch channels. Please check device firmware.
    </div>
  );
}
