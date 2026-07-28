import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import { bookingData } from "../../mock/dashboardData.js";

const COLORS = [
  "#22c55e",
  "#f59e0b",
  "#ef4444",
];

const BookingChart = () => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Booking Status
        </h2>

        <p className="text-sm text-slate-500">
          Current Booking Analytics
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={bookingData}
              innerRadius={70}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
            >
              {bookingData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookingChart;