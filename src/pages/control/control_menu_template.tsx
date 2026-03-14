import { JSX } from "react";
import ControlNavBar from "../../layouts/control_navbar";

export function ControlMenuTemplate({ element }: { element: JSX.Element }) {
  return (
    <div>
      <ControlNavBar />
      <div>{element}</div>
    </div>
  );
}
