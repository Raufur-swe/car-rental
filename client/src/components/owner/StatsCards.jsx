import {
  FaCar,
  FaMoneyBillWave,
  FaClock,
  FaCalendarCheck,
} from "react-icons/fa";

const stats = [
  {
    title: "Total Revenue",
    value: "$18,420",
    icon: FaMoneyBillWave,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Active Cars",
    value: "18",
    icon: FaCar,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Pending Cars",
    value: "4",
    icon: FaClock,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Today's Booking",
    value: "12",
    icon: FaCalendarCheck,
    color: "bg-purple-100 text-purple-600",
  },
];

const StatsCards = () => {
  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{item.title}</p>

                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {item.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.color}`}
              >
                <Icon size={22} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default StatsCards;