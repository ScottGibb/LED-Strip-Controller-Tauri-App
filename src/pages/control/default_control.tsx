import { JSX } from "react";
import ControlNavBar from "../../layouts/control_navbar";

export function DefaultConfiguration({ element }: { element: JSX.Element }) {
  return (
    <div>
      <ControlNavBar />
      <div className="flex justify-center items-center">{element}</div>
      <div className="fixed bottom-8 left-0 right-0 p-4 bg-gray-200">
        <div className="flex flex-row gap-2 items-center">
          <div className="flex gap-2">
            <p>Status:</p>
            <p>Variable</p>
            <p>LED</p>
          </div>
          <div className="ml-auto flex gap-2">
            <p>Power:</p>
            <p>Variable</p>
          </div>
        </div>
      </div>
    </div>
  );
}
