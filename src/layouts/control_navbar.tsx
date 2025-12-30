import { Link } from "react-router-dom";
import { routes, RouteTypeEnum } from "../routes";

const ControlNavBar = () => {
  return (
    <div>
      <nav className="top-nav bg-white border-b border-gray-200 flex justify-around">
        {routes.map(({ title, path, icon, type }) =>
          type == RouteTypeEnum.Control ? (
            <Link
              to={path}
              key={title}
              className="nav-button flex flex-col items-center flex-1 transition-colors duration-200 ease-in-out hover:bg-gray-100 active:bg-gray-200 p-2"
            >
              <span className="icon text-xl">{icon}</span>
              <span className="text text-xs">{title}</span>
            </Link>
          ) : null,
        )}
      </nav>
    </div>
  );
};

export default ControlNavBar;
