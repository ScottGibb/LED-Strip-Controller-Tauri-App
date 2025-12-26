/** Settings for the game.  This page is loaded once before a game starts to determine rules and player count. */
import { useEffect, useState } from "react";
import { getName, getTauriVersion, getVersion } from "@tauri-apps/api/app";

export default function AboutPage() {
  const [appName, setAppName] = useState("");
  const [version, setVersion] = useState("");
  const [tauriVersion, setTauriVersion] = useState("");

  useEffect(() => {
    const loadInfo = async () => {
      setAppName(await getName());
      setVersion(await getVersion());
      setTauriVersion(await getTauriVersion());
    };
    loadInfo();
  }, []);

  return (
    <div>
      <p>Name: {appName}</p>
      <p>Version: {version}</p>
      <p>Developed by: Scott Gibb</p>
      <p>Tauri Version: {tauriVersion}</p>
    </div>
  );
}
