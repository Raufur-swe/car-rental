import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaCar,
  FaPlusCircle,
  FaMoneyBillWave,
  FaChartBar,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const menus = [
  {
    name: "Dashboard",
    icon: <FaHome />,
    path: "/owner",
  },
  {
    name: "All Cars",
    icon: <FaCar />,
    path: "/owner/cars",
  },
  {
    name: "Add Car",
    icon: <FaPlusCircle />,
    path: "/owner/add-car",
  },
  {
    name: "Revenue",
    icon: <FaMoneyBillWave />,
    path: "/owner/revenue",
  },
  {
    name: "Status",
    icon: <FaChartBar />,
    path: "/owner/status",
  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ================= Mobile Header ================= */}

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm lg:hidden">
        <h1 className="text-2xl font-bold tracking-wide text-gray-700">
          AVANZA
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="rounded-xl p-2 transition hover:bg-slate-100"
        >
          <FaBars className="text-2xl text-gray-700" />
        </button>
      </header>

      {/* ================= Overlay ================= */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ================= Sidebar ================= */}

      <aside
        className={`
        fixed
        left-0
        top-0
        z-50
        flex
        h-screen
        w-72
        flex-col
        border-r
        border-slate-200
        bg-white
        shadow-xl
        transition-transform
        duration-300
        ease-in-out

        ${
          open ? "translate-x-0" : "-translate-x-full"
        }

        lg:translate-x-0
        `}
      >
        {/* Logo */}

        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <h1 className="text-3xl font-bold tracking-wide text-gray-700">
            AVANZA
          </h1>

          <button
            onClick={() => setOpen(false)}
            className="rounded-xl p-2 transition hover:bg-slate-100 lg:hidden"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Menu */}

        <div className="flex-1 space-y-2 p-5">
          {menus.map((menu) => (
            <NavLink
              key={menu.name}
              to={menu.path}
              end={menu.path === "/owner"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-4 rounded-2xl px-4 py-3 text-[15px] font-medium transition-all duration-300

                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                }`
              }
            >
              <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                {menu.icon}
              </span>

              {menu.name}
            </NavLink>
          ))}
        </div>

        {/* Logout */}

        <div className="border-t border-slate-200 p-5">
          <button
            className="
            flex
            w-full
            items-center
            gap-4
            rounded-2xl
            bg-red-50
            px-4
            py-3
            font-medium
            text-red-500
            transition-all
            duration-300
            hover:bg-red-500
            hover:text-white
            "
          >
            <FaSignOutAlt />

            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;