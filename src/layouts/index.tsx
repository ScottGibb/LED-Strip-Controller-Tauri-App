import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <ToastContainer />
      <div>
        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
}
