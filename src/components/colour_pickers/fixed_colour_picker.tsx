import { Colour } from "../../types/modes";

const colours = Object.values(Colour);

export interface FixedColourPickerProps {
  selectedColour: Colour;
  setSelectedColour: (colour: Colour) => void;
}
export function FixedColourPicker({
  selectedColour,
  setSelectedColour,
}: FixedColourPickerProps) {
  return (
    <div className="flex flex-col justify-center items-center min-h-50">
      <h1 className="mb-4">Choose your Colour</h1>
      <select
        value={selectedColour}
        onChange={(e) => setSelectedColour(e.target.value as Colour)}
        className="p-2 rounded border"
      >
        {colours.map((colour) => (
          <option key={colour} value={colour}>
            {colour}
          </option>
        ))}
      </select>
      <div className="mt-4 flex items-center">
        <span className="mr-2">Preview:</span>
        <div
          className="w-8 h-8 rounded border"
          style={{
            backgroundColor:
              selectedColour === Colour.Rose ? "#ff007f" : selectedColour,
          }}
          title={selectedColour}
        />
      </div>
    </div>
  );
}
