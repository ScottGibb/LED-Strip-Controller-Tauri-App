import { Routes, Route, useLocation } from "react-router-dom";
import type { JSX, ReactNode } from "react";

import { SettingsPage } from "./pages/settings";
import { HomePage } from "./pages/home";
import { SerialConfigurationPage } from "./pages/configuration/serial";
import AboutPage from "./pages/about";
import { TcpConfigurationPage } from "./pages/configuration/tcp";

type RouteType = {
  title: string;
  path: string;
  element: ReactNode;
  icon?: ReactNode;
  type: RouteTypeEnum;
};

export enum RouteTypeEnum {
  Configuration = "CONFIGURATION",
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
    path: "/settings",
    type: RouteTypeEnum.Configuration,
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
    type: RouteTypeEnum.Configuration,
    element: <SerialConfigurationPage />,
  },
  {
    title: "TCP Configuration",
    path: "/configuration/tcp",
    type: RouteTypeEnum.Configuration,
    element: <TcpConfigurationPage />,
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
