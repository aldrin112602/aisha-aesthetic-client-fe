import { Bell, CalendarCheck, CheckCheck, Mail, Sparkles } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'reminder',
    title: 'Appointment Reminder',
    message:
      'You have an appointment tomorrow at 2:00 PM for Classic Facial.',
    date: 'Today, 9:00 AM',
    unread: true,
  },
  {
    id: 2,
    type: 'confirm',
    title: 'Please Confirm Your Appointment',
    message:
      'Confirm your upcoming appointment to secure your selected schedule.',
    date: 'Yesterday, 10:00 AM',
    unread: true,
  },
  {
    id: 3,
    type: 'booked',
    title: 'Appointment Booked Successfully',
    message:
      'Your appointment for Laser Rejuvenation has been recorded.',
    date: 'Aug 20, 2026',
    unread: false,
  },
  {
    id: 4,
    type: 'welcome',
    title: 'Welcome to Aisha Aesthetics!',
    message: 'Thank you for creating your account. Book your next glow session!',
    date: 'Aug 18, 2026',
    unread: false,
  },
];

function Notification() {
  const getIcon = (type: string) => {
    if (type === 'confirm') return CalendarCheck;
    if (type === 'welcome') return Sparkles;

    return Bell;
  };

  return (
    <div className="page-container">
      {/* Email Notification Status Banner */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <Mail size={18} className="text-green-600" />
        <p className="text-sm font-semibold text-green-800">
          📧 Email notifications enabled. Appointment and reminder emails will be sent to your registered email address.
        </p>
      </div>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">
            Stay updated with your appointments and reminders.
          </p>
        </div>

        <button className="flex items-center gap-2 text-sm font-semibold text-[#d77992] hover:underline">
          <CheckCheck size={17} />
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const Icon = getIcon(notification.type);

          return (
            <div
              key={notification.id}
              className={`flex gap-4 rounded-2xl border p-5 shadow-sm ${
                notification.unread
                  ? 'border-pink-200 bg-[#fffafb]'
                  : 'border-pink-100 bg-white'
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff2df] text-[#c18c2d]">
                <Icon size={20} />
              </div>

              <div className="flex-1">
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <h2 className="font-semibold text-[#4b343b]">
                    {notification.title}
                  </h2>

                  {notification.unread && (
                    <span className="h-2 w-2 rounded-full bg-[#df7f98]" />
                  )}
                </div>

                <p className="mt-2 text-sm leading-6 text-[#80656d]">
                  {notification.message}
                </p>

                <p className="mt-3 text-xs text-[#aa9198]">
                  {notification.date}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Notification;