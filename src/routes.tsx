import { Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import { SettingsPage } from "./pages/settings";

type RouteType = {
  title: string;
  path: string;
  element: React.ReactNode;
  icon?: React.ReactNode;
};

const allRoutes: RouteType[] = [
  {
    title: "Settings",
    path: "/",
    element: <SettingsPage />,
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
