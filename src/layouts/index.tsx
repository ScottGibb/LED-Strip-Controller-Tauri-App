import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import NavBar from "./navbar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <NavBar />
      <ToastContainer />
      <div>
        <div className="grow">{children}</div>
      </div>
    </div>
  );
}
