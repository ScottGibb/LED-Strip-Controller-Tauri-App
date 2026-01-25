import { RgbColorPicker } from "react-colorful";
import { RGB, RGBColourComponent } from "../../types/colours";
interface RgbColourPickerProps {
  selectedRGB: RGB;
  setSelectedRGB: (rgb: RGB) => void;
}

interface ComponentProps {
  selectedRGB: RGB;
  setSelectedRGB: (rgb: RGB) => void;
  chosenComponent: RGBColourComponent;
}

export function RgbColourPicker({
  selectedRGB,
  setSelectedRGB,
}: RgbColourPickerProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="text-center">Choose your own RGB</h1>
      <div className="flex flex-col items-center">
        <RgbColorPicker color={selectedRGB} onChange={setSelectedRGB} />
        <div className="flex flex-col gap-2 mt-2 items-center">
          <ComponentInput
            selectedRGB={selectedRGB}
            setSelectedRGB={setSelectedRGB}
            chosenComponent={RGBColourComponent.R}
          />
          <ComponentInput
            selectedRGB={selectedRGB}
            setSelectedRGB={setSelectedRGB}
            chosenComponent={RGBColourComponent.G}
          />
          <ComponentInput
            selectedRGB={selectedRGB}
            setSelectedRGB={setSelectedRGB}
            chosenComponent={RGBColourComponent.B}
          />
        </div>
      </div>
      <div className="mt-4">
        <p>Hex: {rgbToHex(selectedRGB)}</p>
      </div>
    </div>
  );
}

function ComponentInput({
  selectedRGB,
  setSelectedRGB,
  chosenComponent,
}: ComponentProps) {
  const minValue: number = 0;
  const maxValue: number = 255;
  return (
    <label className="flex items-center gap-2">
      <span>{chosenComponent.toUpperCase()}:</span>
      <input
        type="number"
        min={minValue}
        max={maxValue}
        value={selectedRGB[chosenComponent]}
        onChange={(e) =>
          setSelectedRGB({
            ...selectedRGB,
            [chosenComponent]: Math.max(
              minValue,
              Math.min(maxValue, Number(e.target.value)),
            ),
          })
        }
        className="border rounded p-1 w-20"
      />
    </label>
  );
}
export function rgbToHex({ r, g, b }: RGB): string {
  const clamp = (c: number) => Math.max(0, Math.min(255, c));
  const toHex = (c: number) => {
    const hex = clamp(c).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
