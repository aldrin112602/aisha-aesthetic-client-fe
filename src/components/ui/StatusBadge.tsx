interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusClasses: Record<string, string> = {
  active: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
  completed: 'bg-blue-50 text-blue-700',
  confirmed: 'bg-green-50 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  pending: 'bg-[#fff5df] text-[#b88a2c]',
  scheduled: 'bg-[#fff5df] text-[#b88a2c]',
};

function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${statusClasses[normalizedStatus] || 'bg-gray-100 text-gray-600'} ${className}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
