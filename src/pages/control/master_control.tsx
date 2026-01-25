import { useEffect, useState } from "react";

import { DefaultConfiguration } from "./default_control";
import { Colour, FadeType } from "../../types/modes";
import { info } from "@tauri-apps/plugin-log";
import { getNumChannels } from "../../services/invoke_commands";
import { RgbColourPicker } from "../../components/colour_pickers/rgb_colour_picker";
import { HsvColourPicker } from "../../components/colour_pickers/hsv_colour_picker";

const fadeTypes = Object.values(FadeType);
const colours = Object.values(Colour);

export function MasterControlPage() {
  const [numChannels, setNumChannels] = useState<number>(0);
  const [selectedFadeType, setSelectedFadeType] = useState<FadeType>(
    FadeType.None,
  );
  const [fadeTime, setFadeTime] = useState<number>(0);
  const [selectedColour, setSelectedColour] = useState<Colour>(Colour.Red);
  const [selectedChannels, setSelectedChannels] = useState<number[]>([]);
  const [selectedRGB, setSelectedRGB] = useState<{
    r: number;
    g: number;
    b: number;
  }>({ r: 0, g: 0, b: 0 });
  const [selectedHue, setSelectedHue] = useState<{
    h: number;
    s: number;
    v: number;
  }>({ h: 0, s: 0, v: 0 });

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
        selectedHue,
      })}`,
    );
  }
  useEffect(() => {}, []);
  return (
    <div className="">
      <DefaultConfiguration
        element={
          <div className="p-4 bg-centered-800 rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex flex-col items-center justify-center">
                  <h1>Led Channel</h1>
                  <div>
                    <div className="overflow-y-auto max-h-64 border rounded p-2">
                      {channels.length === 0 && (
                        <div>No channels available</div>
                      )}
                      {channels.map((index) => (
                        <label
                          key={index}
                          className="flex items-center gap-2 mb-2"
                        >
                          <input
                            type="checkbox"
                            onChange={() => {
                              if (selectedChannels.includes(index)) {
                                setSelectedChannels(
                                  selectedChannels.filter((i) => i !== index),
                                );
                              } else {
                                setSelectedChannels([
                                  ...selectedChannels,
                                  index,
                                ]);
                              }
                            }}
                          />
                          <span>Channel {index}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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
                        selectedHSV={selectedHue}
                        setSelectedHSV={setSelectedHue}
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
                      <div className="flex-row justify-center items-center bg-center">
                        <h1> Choose your Colour</h1>
                        <select
                          onChange={(e) =>
                            setSelectedColour(e.target.value as Colour)
                          }
                        >
                          {colours.map((colour) => (
                            <option key={colour} value={colour}>
                              {colour}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                }
              })()}
              <div className="flex flex-col justify-center items-center">
                <h1>Mode</h1>
                <h1>Operation</h1>
                <select
                  className="border rounded p-2 w-full"
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
                    <div>
                      <h1> Fade Time</h1>
                      <input
                        type="number"
                        className="border rounded p-2 w-full"
                        placeholder="Fade Time in ms"
                        value={fadeTime}
                        onChange={(e) => setFadeTime(Number(e.target.value))}
                      />
                    </div>
                  )}
                <button
                  className="btn btn-primary"
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
