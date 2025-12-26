import { Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import { SettingsPage } from "./pages/settings";
import { HomePage } from "./pages/home";
import { SerialConfigurationPage } from "./pages/configuration/serial";
import AboutPage from "./pages/about";
import { TcpConfigurationPage } from "./pages/configuration/tcp";

type RouteType = {
  title: string;
  path: string;
  element: React.ReactNode;
  icon?: React.ReactNode;
  isPrivate: boolean;
};

const allRoutes: RouteType[] = [
  {
    title: "Home",
    path: "/",
    isPrivate: false,
    element: <HomePage />,
  },
  {
    title: "Settings",
    path: "/settings",
    isPrivate: false,

    element: <SettingsPage />,
  },
  {
    title: "About",
    path: "/about",
    isPrivate: false,
    element: <AboutPage />,
  },
  {
    title: "Serial Configuration",
    path: "/configuration/serial",
    isPrivate: true,
    element: <SerialConfigurationPage />,
  },
  {
    title: "TCP Configuration",
    path: "/configuration/tcp",
    isPrivate: true,
    element: <TcpConfigurationPage />,
  },
];

export const routes: RouteType[] = allRoutes;

export default function AppRoutes(): React.ReactNode {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      {/* Map through the routes and create a Route for each */}
      {routes.map(({ path, element, title }) => (
        // Wrap each route in an AnimationWrapper for animation effects
        <Route key={title} path={path} element={element} />
      ))}
    </Routes>
  );
}
