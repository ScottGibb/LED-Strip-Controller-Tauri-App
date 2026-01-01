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
            <span className="text-slate-300">About </span>
            <span className="text-white font-semibold">
              {" "}
              Some good example text can go here Lorem ipsum dolor sit amet
              cuptatibus et porro cum adipisci excepturi itaque obcaecati.
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
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.474-2.237-1.668-2.237-.909 0-1.451.613-1.688 1.208-.087.216-.109.517-.109.819v5.779h-3.554s.047-9.378 0-10.318h3.554v1.462c.457-.704 1.273-1.707 3.101-1.707 2.265 0 3.963 1.481 3.963 4.66v5.903zM5.337 8.855c-1.144 0-1.915-.759-1.915-1.71 0-.956.77-1.71 1.957-1.71 1.188 0 1.915.754 1.94 1.71 0 .951-.752 1.71-1.982 1.71zm1.581 11.597H3.635V9.131h3.283v11.321zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </a>
              <a
                href="https://github.com/ScottGibb/LED-Strip-Controller-Manifest"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.thingiverse.com/scottgibb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-orange-400 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm3.5 8c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm-7 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5z" />
                </svg>
              </a>
              <a
                href="https://www.printables.com/@ScottGibb_242109"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-purple-400 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z" />
                </svg>
              </a>
              <a
                href="https://scottgibb.github.io/Gibbiverse/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-cyan-400 transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
