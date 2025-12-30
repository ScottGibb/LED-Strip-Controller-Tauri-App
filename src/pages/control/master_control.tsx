import { useEffect } from "react";

import { DefaultConfiguration } from "./default_control";

export function MasterControlPage() {
  useEffect(() => {}, []);
  return (
    <div>
      <DefaultConfiguration
        element={
          <div>
            <h1> Hello</h1>
          </div>
        }
      />
    </div>
  );
}
