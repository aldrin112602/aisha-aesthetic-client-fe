import type { DashboardStat } from '../../../types';

function EmployeeStatCard({
  title,
  value,
  icon,
  onClick,
  active,
}: DashboardStat) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:shadow-md ${
        active ? 'border-pink-400 ring-2 ring-pink-100' : 'border-gray-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-800">{value}</p>
        </div>

        <div className="rounded-xl bg-pink-50 p-3 text-pink-500">{icon}</div>
      </div>
    </button>
  );
}

export default EmployeeStatCard;
