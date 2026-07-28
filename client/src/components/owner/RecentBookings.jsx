const RecentBookings = () => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Recent Bookings
        </h2>

        <button className="text-sm font-medium text-blue-600">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 text-left">Customer</th>
              <th className="py-3 text-left">Car</th>
              <th className="py-3 text-left">Status</th>
              <th className="py-3 text-left">Amount</th>
            </tr>
          </thead>

          <tbody>
            {[1,2,3].map((item)=>(
              <tr key={item} className="border-b">
                <td className="py-4">John Doe</td>
                <td>BMW M4</td>
                <td>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600">
                    Completed
                  </span>
                </td>
                <td>$120</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentBookings;