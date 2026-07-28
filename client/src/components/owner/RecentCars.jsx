const RecentCars = () => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Recent Cars
        </h2>

        <button className="text-sm font-medium text-blue-600">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {[1,2,3].map((item)=>(
          <div
            key={item}
            className="flex items-center justify-between rounded-2xl border p-4"
          >
            <div>
              <h3 className="font-semibold">
                BMW M4
              </h3>

              <p className="text-sm text-slate-500">
                Sports
              </p>
            </div>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600">
              Active
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentCars;