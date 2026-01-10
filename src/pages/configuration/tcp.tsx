/** Settings for the game.  This page is loaded once before a game starts to determine rules and player count. */

import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  notifyError,
  notifyInfo,
  notifySuccess,
} from "../../services/notifications";
import { disconnectFromDevice, isConnected } from "./functions";
import { useNavigate } from "react-router-dom";

export function TcpConfigurationPage() {
  const [selectedPort, setSelectedPort] = useState<number>(0);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const navigate = useNavigate();
  useEffect(() => {}, []);

  const connectToDevice = () => {
    notifyInfo("Connecting to device...");
    invoke("connect_tcp_device", {
      address: selectedAddress,
      portNumber: selectedPort,
    })
      .then(() => {
        notifySuccess("Connected to device!");
      })
      .catch((err) => {
        notifyError(`Failed to connect to device: ${err}`);
      });
  };

  const goToControlPage = async () => {
    var connected = await isConnected();
    if (!connected) {
      notifyError("Not connected to a device!");
    } else {
      notifySuccess("Connected to a device!");
      navigate("/control/master_control");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-4">TCP Configuration</h1>
        <input
          type="string"
          placeholder="IP Address"
          onChange={(e) => setSelectedAddress(e.target.value)}
          className="input input-bordered w-full"
        />
        <input
          type="number"
          placeholder="Port"
          onChange={(e) => setSelectedPort(Number(e.target.value))}
          className="input input-bordered w-full"
        />
        <div className="flex gap-2 flex-col">
          <div className="flex gap-2 flex-row">
            <button className="btn btn-primary" onClick={connectToDevice}>
              Connect
            </button>
            <button className="btn btn-primary" onClick={disconnectFromDevice}>
              Disconnect
            </button>
          </div>
          <button
            className="btn btn-secondary"
            onClick={async () => {
              goToControlPage();
            }}
          >
            Continue
          </button>
          <NavLink className="btn btn-secondary" to="/">
            Back
          </NavLink>
        </div>
      </div>
    </div>
  );
}
