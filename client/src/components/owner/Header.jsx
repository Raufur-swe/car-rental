import {
  HiOutlineBars3,
  HiOutlineBell,
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Left */}

        <div className="flex items-center gap-4">

          {/* Mobile Menu */}

          <button className="rounded-xl p-2 transition hover:bg-slate-100 lg:hidden">
            <HiOutlineBars3 size={24} />
          </button>

          <div>
            <h2 className="text-lg font-semibold text-slate-800 sm:text-xl">
              Good Morning 👋
            </h2>

            <p className="hidden text-sm text-slate-500 sm:block">
              Welcome back, Raufur
            </p>
          </div>

        </div>

        {/* Right */}

        <div className="flex items-center gap-3">

          {/* Search */}

          <div className="hidden items-center rounded-2xl border border-slate-200 bg-slate-50 px-4 lg:flex">

            <HiOutlineMagnifyingGlass
              size={20}
              className="text-slate-500"
            />

            <input
              type="text"
              placeholder="Search..."
              className="w-56 bg-transparent px-3 py-3 text-sm outline-none"
            />

          </div>

          {/* Notification */}

          <button className="relative rounded-2xl border border-slate-200 p-3 transition hover:bg-slate-100">

            <HiOutlineBell size={22} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>

          </button>

          {/* Profile */}

          <button className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 transition hover:shadow-md">

            <img
              src="https://i.pravatar.cc/150"
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="hidden text-left md:block">

              <h4 className="text-sm font-semibold">
                Raufur
              </h4>

              <p className="text-xs text-slate-500">
                Owner
              </p>

            </div>

          </button>

        </div>

      </div>
    </header>
  );
};

export default Header;