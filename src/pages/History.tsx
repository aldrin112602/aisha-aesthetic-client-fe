import { CalendarDays, CheckCircle2 } from 'lucide-react';

const history = [
  {
    id: 1,
    service: 'Classic Facial',
    date: 'July 10, 2026',
    price: 1500,
  },
  {
    id: 2,
    service: 'Acne Treatment',
    date: 'June 2, 2026',
    price: 2000,
  },
  {
    id: 3,
    service: 'Wellness Massage',
    date: 'May 15, 2026',
    price: 1200,
  },
];

function History() {
  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">Appointment History</h1>
        <p className="page-subtitle">
          Review your previous treatments and visits.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f9dce3] text-[#d77992]">
                    <CheckCircle2 size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-[#4b343b]">{item.service}</h2>
                    <p className="mt-1 flex items-center gap-1 text-xs text-[#92737c]">
                      <CalendarDays size={13} />
                      {item.date}
                    </p>
                  </div>
                </div>
              </div>

              <span className="text-sm font-bold text-[#c18c2d]">
                ₱{item.price.toLocaleString()}
              </span>
            </div>

            <div className="mt-5 border-t border-pink-100 pt-4">
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                Completed
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;