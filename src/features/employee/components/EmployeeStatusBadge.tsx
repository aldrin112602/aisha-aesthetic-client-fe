import { CheckCircle2, Clock3, XCircle } from 'lucide-react';

import type { EmployeeStatusBadgeProps } from '../../../types';

function EmployeeStatusBadge({ status }: EmployeeStatusBadgeProps) {
  const normalizedStatus = status?.toLowerCase();

  if (normalizedStatus === 'confirmed') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        <CheckCircle2 size={14} />
        Confirmed
      </span>
    );
  }

  if (normalizedStatus === 'cancelled') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        <XCircle size={14} />
        Cancelled
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
      <Clock3 size={14} />
      Pending
    </span>
  );
}

export default EmployeeStatusBadge;
