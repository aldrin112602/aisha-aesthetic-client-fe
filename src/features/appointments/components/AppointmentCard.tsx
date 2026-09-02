import { CalendarDays, Clock3, MapPin } from 'lucide-react';

import StatusBadge from '../../../components/ui/StatusBadge';
import type { Appointment } from '../../../types';

interface AppointmentCardProps {
  appointment: Appointment;
}

function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <article className="rounded-lg border border-pink-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-[#5b3e45]">
            {appointment.serviceName}
          </h3>
          <p className="text-xs text-[#92737c]">{appointment.category}</p>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="grid gap-2 text-sm text-[#5b3e45]">
        <span className="flex items-center gap-2">
          <CalendarDays size={16} />
          {appointment.date}
        </span>
        <span className="flex items-center gap-2">
          <Clock3 size={16} />
          {appointment.time}
        </span>
        <span className="flex items-center gap-2">
          <MapPin size={16} />
          {appointment.area}
        </span>
      </div>
    </article>
  );
}

export default AppointmentCard;
