/** Settings for the game.  This page is loaded once before a game starts to determine rules and player count. */
import { useEffect, useState } from "react";
import { getName, getTauriVersion, getVersion } from "@tauri-apps/api/app";
// import { FaGithub } from "react-icons/fa6";

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-slate-700 rounded-lg shadow-2xl p-8 max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-white text-center">{appName}</h1>

        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-600 rounded-lg p-4">
            <span className="text-slate-300">Version</span>
            <span className="text-white font-semibold">{version}</span>
          </div>

          <div className="flex items-center justify-between bg-slate-600 rounded-lg p-4">
            <span className="text-slate-300">Tauri Version</span>
            <span className="text-white font-semibold">{tauriVersion}</span>
          </div>

          <div className="flex items-center justify-between bg-slate-600 rounded-lg p-4">
            <span className="text-slate-300">Developer</span>
            <span className="text-white font-semibold">Scott Gibb</span>
          </div>
        </div>
      </div>
    </div>
  );
}
