/** About page displaying application information, version details, and developer links. */
import { useEffect, useState } from "react";
import { getName, getTauriVersion, getVersion } from "@tauri-apps/api/app";
import LinkedinIcon from "../assets/linkedin.svg?react";
import GithubIcon from "../assets/github.svg?react";
import PrintablesIcon from "../assets/printables.svg?react";
import ThingiverseIcon from "../assets/thingiverse.svg?react";
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
          <div className="bg-slate-600 rounded-lg p-4">
            <span className="text-slate-300 block mb-2 font-medium">About</span>
            <span className="text-white text-sm leading-relaxed">
              A cross-platform desktop application for controlling LED strips
              over Serial/USB or TCP/IP connections. Configure colours, effects,
              and brightness from a single interface — built with Tauri and
              React.
            </span>
          </div>
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
          <div>
            <div className="flex justify-center gap-4 pt-4">
              <a
                href="https://www.linkedin.com/in/scott-gibb-ces/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-blue-400 transition"
              >
                <LinkedinIcon className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/ScottGibb/LED-Strip-Controller-Manifest"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition"
              >
                <GithubIcon className="w-6 h-6" />
              </a>
              <a
                href="https://www.thingiverse.com/scottgibb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-orange-400 transition"
              >
                <ThingiverseIcon className="w-6 h-6" />
              </a>
              <a
                href="https://www.printables.com/@ScottGibb_242109"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-purple-400 transition"
              >
                <PrintablesIcon className="w-6 h-6" />
              </a>
              <a
                href="https://scottgibb.github.io/Gibbiverse/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-cyan-400 transition"
              ></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
