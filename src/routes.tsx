import { Routes, Route, useLocation } from "react-router-dom";
import type { JSX, ReactNode } from "react";

import { SettingsPage } from "./pages/control/settings";
import { HomePage } from "./pages/home";
import { SerialConfigurationPage } from "./pages/configuration/serial";
import AboutPage from "./pages/about";
import { TcpConfigurationPage } from "./pages/configuration/tcp";
import { MasterControlPage } from "./pages/control/master_control";
import { StripControlPage } from "./pages/control/strip_control";

type RouteType = {
  title: string;
  path: string;
  element: ReactNode;
  icon?: ReactNode;
  type: RouteTypeEnum;
};

export enum RouteTypeEnum {
  Initialisation = "INITIALISATION",
  Control = "CONTROL",
  General = "GENERAL",
}

export const routes: RouteType[] = [
  {
    title: "Home",
    path: "/",
    type: RouteTypeEnum.General,
    element: <HomePage />,
  },
  {
    title: "Settings",
    path: "/control/settings",
    type: RouteTypeEnum.Control,
    element: <SettingsPage />,
  },
  {
    title: "About",
    path: "/about",
    type: RouteTypeEnum.General,
    element: <AboutPage />,
  },
  {
    title: "Serial Configuration",
    path: "/configuration/serial",
    type: RouteTypeEnum.Initialisation,
    element: <SerialConfigurationPage />,
  },
  {
    title: "TCP Configuration",
    path: "/configuration/tcp",
    type: RouteTypeEnum.Initialisation,
    element: <TcpConfigurationPage />,
  },
  {
    title: "Master Control",
    path: "/control/master_control",
    type: RouteTypeEnum.Control,
    element: <MasterControlPage />,
  },
  {
    title: "Strip Control",
    path: "/control/strip_control",
    type: RouteTypeEnum.Control,
    element: <StripControlPage />,
  },
];

export default function AppRoutes(): JSX.Element {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {routes.map(({ path, element, title }) => (
        <Route key={title} path={path} element={element} />
      ))}
    </Routes>
  );
}
