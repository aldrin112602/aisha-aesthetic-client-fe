import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Heart,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import beautyWoman from '../assets/img/beauty.png';

const services = [
  {
    name: 'Facial Treatments',
    description: 'Restore your natural glow',
    icon: Sparkles,
  },
  {
    name: 'Skin Rejuvenation',
    description: 'Fresh and healthy-looking skin',
    icon: Heart,
  },
  {
    name: 'Body Treatments',
    description: 'Relax and feel confident',
    icon: Sparkles,
  },
];

function Dashboard() {
  return (
    <div className="page-container">
      {/* Welcome Section */}
      <section className="mb-6 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        {/* Hero Banner */}
        <div className="relative min-h-[300px] overflow-hidden rounded-3xl bg-[#fa688c]">
          {/* Background Image */}
          <img
            src={beautyWoman}
            alt="Aisha Aesthetics Beauty Treatment"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* Pink Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fce8ed] via-[#fce8ed]/10 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 flex min-h-[320px] max-w-[60%] flex-col justify-center p-7 sm:p-10">
            <span className="gold-badge w-fit">
              Beauty • Aesthetics • Wellness
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-tight text-[#4b343b] sm:text-4xl">
              Glow with Confidence,
              <br />
              <span className="text-[#d77a93]">Feel Beautiful.</span>
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-[#6f555d] sm:text-base">
              Enhance your beauty and wellness with our premium services. Book
              your appointment easily and manage your beauty journey in one
              place.
            </p>

            <Link
              to="/booking"
              className="primary-btn mt-6 inline-flex w-fit items-center gap-2"
            >
              Book Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Next Appointment */}
        <div className="pink-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#4b343b]">
                Next Appointment
              </h3>

              <CalendarDays size={20} className="text-[#c99a3d]" />
            </div>

            <div className="mt-6">
              <span className="gold-badge">Confirmed</span>

              <h4 className="mt-4 text-xl font-bold text-[#4b343b]">
                Classic Facial
              </h4>

              <p className="mt-1 text-sm text-[#80656d]">
                Main Branch • Treatment Area A
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-[#80656d]">
                  <CalendarDays size={16} />
                  Aug 30, 2026
                </div>

                <div className="flex items-center gap-2 text-sm text-[#80656d]">
                  <Clock3 size={16} />
                  2:00 PM
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/appointments"
            className="mt-8 text-sm font-semibold text-[#d77992] hover:underline"
          >
            View appointment  
          </Link>
        </div>
      </section>

      {/* Services */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#4b343b]">
              Our Services
            </h2>

            <p className="mt-1 text-sm text-[#92737c]">
              Choose the treatment that's right for you.
            </p>
          </div>

          <Link
            to="/booking"
            className="text-sm font-semibold text-[#d77992] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                key={service.name}
                to="/booking"
                className="group rounded-2xl border border-pink-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff3df] text-[#bd8a2e]">
                  <Icon size={22} />
                </div>

                <h3 className="mt-4 font-bold text-[#4b343b]">
                  {service.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#92737c]">
                  {service.description}
                </p>

                <div className="mt-4 text-sm font-semibold text-[#d77992]">
                  <button className="primary-btn">Book Now</button>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Info */}
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {/* Upcoming */}
        <div className="pink-card">
          <p className="text-sm text-[#92737c]">Upcoming</p>

          <p className="mt-2 text-3xl font-bold text-[#4b343b]">1</p>

          <p className="mt-1 text-xs text-[#c18c2d]">
            You have an upcoming appointment
          </p>
        </div>

        {/* Completed Visits */}
        <div className="pink-card">
          <p className="text-sm text-[#92737c]">Completed Visits</p>

          <p className="mt-2 text-3xl font-bold text-[#4b343b]">5</p>

          <p className="mt-1 text-xs text-[#7ca383]">
            Your beauty journey continues
          </p>
        </div>

        {/* Notifications */}
        <div className="pink-card">
          <p className="text-sm text-[#92737c]">Notifications</p>

          <p className="mt-2 text-3xl font-bold text-[#4b343b]">2</p>

          <p className="mt-1 text-xs text-[#d77992]">
            You have unread reminders
          </p>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;