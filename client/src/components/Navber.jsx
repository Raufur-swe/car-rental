import { useState } from "react";
import {
  HiOutlineMenuAlt3,
  HiOutlineX,
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineMail,
} from "react-icons/hi";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const navItems = [
  {
    name: "Home",
    path: "/",
    icon: <HiOutlineHome size={18} />,
  },
  {
    name: "About",
    path: "/about",
    icon: <HiOutlineUser size={18} />,
  },
  {
    name: "Projects",
    path: "/projects",
    icon: <HiOutlineBriefcase size={18} />,
  },
  {
    name: "Contact",
    path: "/contact",
    icon: <HiOutlineMail size={18} />,
  },
];

export default function Navber() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const smoothNavigate = (path) => {
    setOpen(false);

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        navigate(path);
      });
    } else {
      navigate(path);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <header className="fixed top-5 left-0 z-50 w-full px-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/40 bg-white/55 px-6 py-3 shadow-[0_10px_40px_rgba(0,0,0,.08)] backdrop-blur-xl">

        {/* Logo */}

        <img  src={logo} alt="Logo" onClick={() => smoothNavigate("/")} className="cursor-pointer h-20 w-30 bg-slate-100 rounded-2xl" />
        {/* Desktop */}

        <nav className="hidden items-center gap-2 rounded-full bg-white/60 p-1 lg:flex">

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={(e) => {
                e.preventDefault();
                smoothNavigate(item.path);
              }}
              className={({ isActive }) =>
                `group flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ease-out
                 ${
                   isActive
                     ? "bg-black text-white shadow-lg"
                     : "text-black hover:bg-black hover:text-white"
                 }`
              }
            >
              <span className="transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </span>

              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Right */}

        <div className="hidden items-center gap-3 lg:flex">

          <button className="rounded-full px-5 py-2 font-medium transition-all duration-300 hover:scale-105">
            Login
          </button>

          <button className="rounded-full bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95">
            Sign Up
          </button>
        </div>

        {/* Mobile */}

        <button
          onClick={() => setOpen(!open)}
          className="rounded-xl border border-black/10 p-2 transition lg:hidden"
        >
          {open ? (
            <HiOutlineX size={24} />
          ) : (
            <HiOutlineMenuAlt3 size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}

      <div
        className={`overflow-hidden transition-all duration-500 ease-out lg:hidden ${
          open
            ? "mt-3 max-h-[450px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-2xl border border-white/30 bg-white/70 p-4 shadow-xl backdrop-blur-xl">

          <div className="flex flex-col gap-2">

            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  smoothNavigate(item.path);
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition-all duration-300
                   ${
                     isActive
                       ? "bg-black text-white"
                       : "hover:bg-black hover:text-white"
                   }`
                }
              >
                {item.icon}

                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3">

            <button className="rounded-xl border border-black/10 py-3 transition hover:bg-black hover:text-white">
              Login
            </button>

            <button className="rounded-xl bg-black py-3 text-white transition-all duration-300 hover:scale-[1.02] active:scale-95">
              Sign Up
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}