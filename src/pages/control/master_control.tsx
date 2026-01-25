import { useEffect, useState } from "react";

import { Colour, FadeType } from "../../types/modes";
import { info } from "@tauri-apps/plugin-log";
import { getNumChannels } from "../../services/invoke_commands";
import { RgbColourPicker } from "../../components/colour_pickers/rgb_colour_picker";
import { HsvColourPicker } from "../../components/colour_pickers/hsv_colour_picker";
import { ControlMenuTemplate } from "./control_menu_template";
import { HSV, RGB } from "../../types/colours";
import { ChannelPicker } from "../../components/channel_picker";
import { FixedColourPicker } from "../../components/colour_pickers/fixed_colour_picker";

const fadeTypes = Object.values(FadeType);

export function MasterControlPage() {
  const [numChannels, setNumChannels] = useState<number>(0);
  const [selectedChannels, setSelectedChannels] = useState<number[]>([]);

  const [selectedFadeType, setSelectedFadeType] = useState<FadeType>(
    FadeType.None,
  );
  const [fadeTime, setFadeTime] = useState<number>(0);
  const [selectedColour, setSelectedColour] = useState<Colour>(Colour.Red);

  const [selectedRGB, setSelectedRGB] = useState<RGB>({ r: 0, g: 0, b: 0 });
  const [selectedHSV, setSelectedHSV] = useState<HSV>({ h: 0, s: 0, v: 0 });

  useEffect(() => {
    const fetchChannels = async () => {
      const count = await getNumChannels();
      setNumChannels(count);
    };
    fetchChannels();
  }, []);

  const channels = Array.from({ length: numChannels }, (_, i) => i + 1);

  function selectedMode() {
    info(
      `Master Control - Selected Mode: ${JSON.stringify({
        selectedFadeType,
        fadeTime,
        selectedColour,
        selectedChannels,
        selectedRGB,
        selectedHSV,
      })}`,
    );
  }
  useEffect(() => {}, []);
  return (
    <div className="">
      <ControlMenuTemplate
        element={
          <div className="p-4 bg-centered-800 rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <ChannelPicker
                channels={channels}
                selectedChannels={selectedChannels}
                setSelectedChannels={setSelectedChannels}
              />
              {(() => {
                switch (selectedFadeType) {
                  case FadeType.RgbControl:
                    return (
                      <RgbColourPicker
                        selectedRGB={selectedRGB}
                        setSelectedRGB={setSelectedRGB}
                      />
                    );
                  case FadeType.HueControl:
                    return (
                      <HsvColourPicker
                        selectedHSV={selectedHSV}
                        setSelectedHSV={setSelectedHSV}
                      />
                    );
                  case FadeType.ColourChange:
                    return (
                      <div>
                        <h1>
                          This mode will cycle through some predefined colours
                        </h1>
                      </div>
                    );
                  case FadeType.None:
                    return (
                      <div className="flex justify-center items-center">
                        Choose a Mode to get started
                      </div>
                    );
                  default:
                    return (
                      <FixedColourPicker
                        selectedColour={selectedColour}
                        setSelectedColour={setSelectedColour}
                      />
                    );
                }
              })()}
              <div className="flex flex-col gap-4 justify-center items-center">
                <h1 className="text-lg font-semibold">Mode</h1>
                <h1 className="text-md">Operation</h1>
                <select
                  className="border rounded p-2 w-full max-w-xs"
                  value={selectedFadeType}
                  onChange={(e) =>
                    setSelectedFadeType(e.target.value as FadeType)
                  }
                >
                  {fadeTypes.map((fadeType) => (
                    <option key={fadeType} value={fadeType}>
                      {fadeType}
                    </option>
                  ))}
                </select>
                {selectedFadeType !== FadeType.RgbControl &&
                  selectedFadeType !== FadeType.HueControl && (
                    <div className="flex flex-col items-center justify-center w-full gap-2">
                      <h1 className="text-md">Fade Time</h1>
                      <input
                        type="number"
                        className="border rounded p-2 w-full max-w-xs text-center"
                        placeholder="Fade Time in ms"
                        value={fadeTime}
                        onChange={(e) => setFadeTime(Number(e.target.value))}
                      />
                    </div>
                  )}
                <button
                  className="btn btn-primary w-full max-w-xs mt-2"
                  onClick={() => selectedMode()}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
