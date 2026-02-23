import { HsvColorPicker } from "react-colorful";
import { HSV, HSVColourComponent } from "../../types/colours";

interface HsvColourPickerProps {
  selectedHSV: HSV;
  setSelectedHSV: (hsv: HSV) => void;
}

interface ComponentProps {
  selectedHSV: HSV;
  setSelectedHSV: (hsv: HSV) => void;
  chosenComponent: HSVColourComponent;
}

export function HsvColourPicker({
  selectedHSV,
  setSelectedHSV,
}: HsvColourPickerProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h1 className="text-center">Choose your own HSV</h1>
      <div className="flex flex-col items-center">
        <HsvColorPicker color={selectedHSV} onChange={setSelectedHSV} />
        <div className="flex flex-col gap-2 mt-2 items-center">
          <ComponentInput
            selectedHSV={selectedHSV}
            setSelectedHSV={setSelectedHSV}
            chosenComponent={HSVColourComponent.H}
          />
          <ComponentInput
            selectedHSV={selectedHSV}
            setSelectedHSV={setSelectedHSV}
            chosenComponent={HSVColourComponent.S}
          />
          <ComponentInput
            selectedHSV={selectedHSV}
            setSelectedHSV={setSelectedHSV}
            chosenComponent={HSVColourComponent.V}
          />
        </div>
      </div>
    </div>
  );
}

function ComponentInput({
  selectedHSV,
  setSelectedHSV,
  chosenComponent,
}: ComponentProps) {
  const minValue: number = 0;
  const maxValue: number = chosenComponent === HSVColourComponent.H ? 360 : 100;
  return (
    <label className="flex items-center gap-2">
      <span>{chosenComponent.toUpperCase()}:</span>
      <input
        type="number"
        min={minValue}
        max={maxValue}
        value={selectedHSV[chosenComponent]}
        onChange={(e) =>
          setSelectedHSV({
            ...selectedHSV,
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
