import { useState } from 'react';
import {
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Sparkles,
} from 'lucide-react';

// ==========================================
// SERVICE IMAGES
// ==========================================

import snowWhiteImage from '../assets/img/snowhite.png';
import cinderellaImage from '../assets/img/cinderella.png';

import classicLashesImage from '../assets/img/classiclash.png';
import dailyWearLashesImage from '../assets/img/dailywearlash.png';
import russianLashesImage from '../assets/img/russian.png';
import hybridLashesImage from '../assets/img/hybridlash.png';
import volumeLashesImage from '../assets/img/volumelash.png';
import wispyLashesImage from '../assets/img/wispy.png';
import megaVolumeLashesImage from '../assets/img/megavolumelash.png';

// ==========================================
// NAIL SERVICE IMAGES
// ==========================================

// import manicureImage from '../assets/img/manicure.png';

import pedicureImage from '../assets/img/pedicure.png';
import footSpaImage from '../assets/img/footspa.png';
import parafinWaxImage from '../assets/img/parafinwax.png';
import footMassageImage from '../assets/img/footmassage.png';

// import gelPolishImage from '../assets/img/gelpolish.png';
// import gelRemovalImage from '../assets/img/gelremoval.png';
// import softGelNailImage from '../assets/img/softgelnailext.jpg';

// ==========================================
// SERVICES
// ==========================================

const services = [
  // ==========================================
  // GLUTA DRIP
  // ==========================================

  {
    id: 1,
    name: 'Snow White Drip',
    category: 'Gluta Drip',
    description:
      'Premium intravenous formula with glutathione, Vitamin C, immune boosters, and antioxidants.',
    price: 1500,
    duration: '60 mins',
    image: snowWhiteImage,
  },

  {
    id: 2,
    name: 'Cinderella Drip',
    category: 'Gluta Drip',
    description:
      'Beauty and vitality formula with glutathione, Vitamin C, beauty nutrients, and detox support.',
    price: 1500,
    duration: '60 mins',
    image: cinderellaImage,
  },

  // ==========================================
  // EYELASH EXTENSIONS
  // ==========================================

  {
    id: 3,
    name: 'Classic Lashes',
    category: 'Eyelash Extensions',
    description:
      'Natural, clean, and timeless lash look.',
    price: 199,
    duration: '60 mins',
    image: classicLashesImage,
  },

  {
    id: 4,
    name: 'Daily Wear Lashes',
    category: 'Eyelash Extensions',
    description:
      'Light and natural lashes perfect for everyday wear.',
    price: 349,
    duration: '60 mins',
    image: dailyWearLashesImage,
  },

  {
    id: 5,
    name: 'Russian Lashes',
    category: 'Eyelash Extensions',
    description:
      'More volume and definition with fine, lightweight lash fans.',
    price: 499,
    duration: '75 mins',
    image: russianLashesImage,
  },

  {
    id: 6,
    name: 'Hybrid Lashes',
    category: 'Eyelash Extensions',
    description:
      'A beautiful blend of classic and volume lashes.',
    price: 799,
    duration: '75 mins',
    image: hybridLashesImage,
  },

  {
    id: 7,
    name: 'Volume Lashes',
    category: 'Eyelash Extensions',
    description:
      'Soft, fluffy lashes for a fuller and glamorous look.',
    price: 999,
    duration: '90 mins',
    image: volumeLashesImage,
  },

  {
    id: 8,
    name: 'Wispy Lashes',
    category: 'Eyelash Extensions',
    description:
      'Textured, trendy, and glamorous wispy lash style.',
    price: 1299,
    duration: '90 mins',
    image: wispyLashesImage,
  },

  {
    id: 9,
    name: 'Mega Volume Lashes',
    category: 'Eyelash Extensions',
    description:
      'Ultra-full, bold, and dramatic lashes for a statement look.',
    price: 1499,
    duration: '120 mins',
    image: megaVolumeLashesImage,
  },

  // ==========================================
  // NAIL SERVICES
  // ==========================================

  {
    id: 11,
    name: 'Pedicure',
    category: 'Nail Services',
    description:
      'Relaxing foot and nail care for clean and well-groomed feet.',
    price: 149,
    duration: '45 mins',
    image: pedicureImage,
  },

  {
    id: 12,
    name: 'Foot Spa',
    category: 'Nail Services',
    description:
      'Relaxing foot treatment designed to refresh and pamper your feet.',
    price: 199,
    duration: '60 mins',
    image: footSpaImage,
  },

  {
    id: 13,
    name: 'Parafin Wax',
    category: 'Nail Services',
    description:
      'Warm paraffin treatment to help soften and moisturize the skin.',
    price: 149,
    duration: '30 mins',
    image: parafinWaxImage,
  },

  {
    id: 14,
    name: 'Foot Massage',
    category: 'Nail Services',
    description:
      'Relaxing foot massage to help ease tension and refresh tired feet.',
    price: 149,
    duration: '30 mins',
    image: footMassageImage,
  },
];

// ==========================================
// TIME SLOTS
// ==========================================

const timeSlots = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
];

// ==========================================
// BOOKING COMPONENT
// ==========================================

function Booking() {
  // ==========================================
  // STATES
  // ==========================================

  const [selectedService, setSelectedService] =
    useState<number | null>(null);

  const [selectedDate, setSelectedDate] =
    useState<string>('');

  const [selectedTime, setSelectedTime] =
    useState<string>('');

  const [selectedArea, setSelectedArea] =
    useState<string>('Main Branch - Area A');

  const [isSubmitting, setIsSubmitting] =
    useState<boolean>(false);

  // ==========================================
  // SELECTED SERVICE
  // ==========================================

  const service = services.find(
    (item) => item.id === selectedService
  );

  // ==========================================
  // TODAY
  // ==========================================

  const today = new Date();

  const todayString =
    today.getFullYear() +
    '-' +
    String(today.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(today.getDate()).padStart(2, '0');

  // ==========================================
  // HANDLE DATE
  // ==========================================

  const handleDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const date = event.target.value;

    setSelectedDate(date);

    console.log('Selected Date:', date);
  };

  // ==========================================
  // HANDLE TIME
  // ==========================================

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);

    console.log('Selected Time:', time);
  };

  // ==========================================
  // HANDLE AREA
  // ==========================================

  const handleAreaChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const area = event.target.value;

    setSelectedArea(area);

    console.log('Selected Area:', area);
  };

  // ==========================================
  // HANDLE BOOKING
  // ==========================================

  const handleBooking = async () => {
    if (!service) {
      alert('Please select a service.');
      return;
    }

    if (!selectedDate) {
      alert('Please select an appointment date.');
      return;
    }

    if (!selectedTime) {
      alert('Please select an available time.');
      return;
    }

    if (!selectedArea) {
      alert('Please select a shop area.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service.id,
          serviceName: service.name,
          category: service.category,
          date: selectedDate,
          time: selectedTime,
          area: selectedArea,
          price: service.price,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to book appointment.');
      }

      alert(
        `Appointment booked successfully!\n\nService: ${service.name}\nDate: ${selectedDate}\nTime: ${selectedTime}\nArea: ${selectedArea}\nPrice: ₱${service.price.toLocaleString()}`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong.';

      alert(`Booking failed: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-container w-full min-w-0 overflow-x-hidden">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}

      <div className="mb-5 sm:mb-6">

        <div className="mb-2 flex items-center gap-2">

          <Sparkles
            size={18}
            className="shrink-0 text-[#c18c2d]"
          />

          <span className="truncate text-xs font-semibold uppercase tracking-[0.15em] text-[#c18c2d] sm:text-sm sm:tracking-[0.2em]">
            Aishaesthetics
          </span>

        </div>

        <h1 className="page-title">
          Book an Appointment
        </h1>

        <p className="page-subtitle">
          Choose your preferred beauty and wellness service, date,
          and available time.
        </p>

      </div>


      {/* ==========================================
          MAIN BOOKING LAYOUT
      ========================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          sm:gap-6
          xl:grid-cols-[minmax(0,1fr)_360px]
          xl:items-start
        "
      >

        {/* ==========================================
            LEFT CONTENT
        ========================================== */}

        <div className="min-w-0 space-y-5 sm:space-y-6">

          {/* ==========================================
              STEP 1 - SERVICE
          ========================================== */}

          <section className="pink-card">

            <div className="mb-5 flex items-center gap-3">

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#df7f98] text-sm font-bold text-white">
                1
              </span>

              <div className="min-w-0">

                <h2 className="font-bold text-[#4b343b]">
                  Choose a Service
                </h2>

                <p className="text-xs text-[#92737c]">
                  Select the treatment you want to book.
                </p>

              </div>

            </div>


            {/* ==========================================
                SERVICE CARDS
            ========================================== */}

            <div
              className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
              "
            >

              {services.map((item) => {

                const active =
                  selectedService === item.id;

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() =>
                      setSelectedService(item.id)
                    }
                    className={`group relative min-w-0 overflow-hidden rounded-2xl border text-left transition-all duration-200 ${
                      active
                        ? 'border-[#df7f98] bg-[#fff4f6] ring-2 ring-pink-100 shadow-md'
                        : 'border-pink-100 bg-white hover:-translate-y-1 hover:border-[#e8b4c1] hover:shadow-md'
                    }`}
                  >

                    {/* CHECK */}

                    {active && (
                      <div className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#df7f98] text-white shadow">

                        <Check
                          size={16}
                          strokeWidth={3}
                        />

                      </div>
                    )}


                    {/* IMAGE */}

                    <div
                      className="
                        relative
                        h-44
                        overflow-hidden
                        bg-[#fff4f6]
                        sm:h-40
                      "
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                        className="
                          h-full
                          w-full
                          object-cover
                          transition
                          duration-300
                          group-hover:scale-105
                        "
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                      <div className="absolute bottom-3 left-3 right-3">

                        <span className="inline-block max-w-full truncate rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#b14f70] shadow-sm backdrop-blur-sm">
                          {item.category}
                        </span>

                      </div>

                    </div>


                    {/* CONTENT */}

                    <div className="p-4">

                      <h3 className="pr-8 font-bold text-[#4b343b]">
                        {item.name}
                      </h3>

                      <p className="mt-2 min-h-[40px] text-xs leading-5 text-[#92737c]">
                        {item.description}
                      </p>


                      <div
                        className="
                          mt-4
                          flex
                          flex-col
                          gap-2
                          border-t
                          border-pink-100
                          pt-3
                          min-[420px]:flex-row
                          min-[420px]:items-center
                          min-[420px]:justify-between
                        "
                      >

                        <span className="text-base font-bold text-[#c18c2d]">
                          ₱{item.price.toLocaleString()}
                        </span>

                        <span className="flex items-center gap-1 text-xs font-medium text-[#92737c]">

                          <Clock3 size={13} />

                          {item.duration}

                        </span>

                      </div>

                    </div>

                  </button>
                );
              })}

            </div>

          </section>


          {/* ==========================================
              STEP 2 - DATE & TIME
          ========================================== */}

          <section className="pink-card">

            <div className="mb-5 flex items-center gap-3">

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#df7f98] text-sm font-bold text-white">
                2
              </span>

              <div className="min-w-0">

                <h2 className="font-bold text-[#4b343b]">
                  Date & Time
                </h2>

                <p className="text-xs text-[#92737c]">
                  Choose your preferred schedule.
                </p>

              </div>

            </div>


            {/* ==========================================
                DATE + SHOP AREA
            ========================================== */}

            <div
              className="
                grid
                grid-cols-1
                gap-5
                md:grid-cols-2
              "
            >

              {/* ========================================
                  DATE
              ======================================== */}

              <div className="min-w-0">

                <label
                  htmlFor="appointment-date"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#5d444c]"
                >

                  <CalendarDays
                    size={16}
                    className="shrink-0 text-[#c18c2d]"
                  />

                  Appointment Date

                </label>


                <input
                  id="appointment-date"
                  type="date"
                  value={selectedDate}
                  min={todayString}
                  onChange={handleDateChange}
                  className="
                    input-field
                    w-full
                    min-w-0
                    cursor-pointer
                  "
                />

              </div>


              {/* ========================================
                  SHOP AREA
              ======================================== */}

              <div className="min-w-0">

                <label
                  htmlFor="shop-area"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#5d444c]"
                >

                  <MapPin
                    size={16}
                    className="shrink-0 text-[#c18c2d]"
                  />

                  Shop Area

                </label>


                <select
                  id="shop-area"
                  value={selectedArea}
                  onChange={handleAreaChange}
                  className="
                    input-field
                    w-full
                    min-w-0
                    cursor-pointer
                  "
                >

                  <option value="Main Branch - Area A">
                    Main Branch - Area A
                  </option>

                  <option value="Main Branch - Area B">
                    Main Branch - Area B
                  </option>

                  <option value="VIP Treatment Room">
                    VIP Treatment Room
                  </option>

                </select>

              </div>

            </div>


            {/* ==========================================
                AVAILABLE TIME
            ========================================== */}

            <div className="mt-6">

              <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#5d444c]">

                <Clock3
                  size={16}
                  className="shrink-0 text-[#c18c2d]"
                />

                Available Time

              </label>


              <div
                className="
                  grid
                  grid-cols-2
                  gap-2.5
                  min-[420px]:gap-3
                  sm:grid-cols-3
                  lg:grid-cols-4
                "
              >

                {timeSlots.map((time) => {

                  const active =
                    selectedTime === time;

                  return (
                    <button
                      type="button"
                      key={time}
                      onClick={() =>
                        handleTimeChange(time)
                      }
                      className={`min-w-0 rounded-xl border px-2 py-3 text-xs font-medium transition sm:px-4 sm:text-sm ${
                        active
                          ? 'border-[#df7f98] bg-[#df7f98] text-white shadow-sm'
                          : 'border-pink-100 bg-[#fffafb] text-[#73555f] hover:border-[#e2a0b1] hover:bg-[#fff4f6]'
                      }`}
                    >

                      {time}

                    </button>
                  );

                })}

              </div>

            </div>

          </section>

        </div>


        {/* ==========================================
            BOOKING SUMMARY
        ========================================== */}

        <aside
          className="
            order-last
            w-full
            min-w-0
            overflow-hidden
            rounded-3xl
            border
            border-pink-100
            bg-white
            shadow-sm

            xl:order-none
            xl:sticky
            xl:top-24
            xl:max-h-[calc(100vh-7rem)]
          "
        >

          {/* ==========================================
              SUMMARY HEADER
          ========================================== */}

          <div
            className="
              border-b
              border-pink-100
              bg-[#fff4f6]
              p-4
              sm:p-6
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[#df7f98]
                  text-white
                  sm:h-11
                  sm:w-11
                "
              >

                <CalendarDays size={20} />

              </div>


              <div className="min-w-0">

                <h2 className="text-base font-bold text-[#4b343b] sm:text-lg">
                  Booking Summary
                </h2>

                <p className="text-xs text-[#92737c]">
                  Review your appointment.
                </p>

              </div>

            </div>

          </div>


          {/* ==========================================
              SUMMARY CONTENT

              MOBILE:
              NORMAL PAGE FLOW

              DESKTOP:
              SCROLLABLE
          ========================================== */}

          <div
            className="
              p-4
              sm:p-6

              xl:max-h-[calc(100vh-13rem)]
              xl:overflow-y-auto
              xl:overscroll-contain

              [scrollbar-color:#e2a0b1_#fff4f6]
              [scrollbar-width:thin]
            "
          >

            {/* ==========================================
                SELECTED SERVICE
            ========================================== */}

            {service && (

              <div className="mb-5 overflow-hidden rounded-2xl border border-pink-100 bg-[#fffafb]">

                <img
                  src={service.image}
                  alt={service.name}
                  className="
                    h-36
                    w-full
                    object-cover
                    sm:h-40
                  "
                />

                <div className="p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#b14f70]">
                    {service.category}
                  </p>

                  <h3 className="mt-1 break-words font-bold text-[#4b343b]">
                    {service.name}
                  </h3>

                  <p className="mt-1 text-xs text-[#92737c]">
                    {service.duration}
                  </p>

                </div>

              </div>

            )}


            {/* ==========================================
                NO SERVICE
            ========================================== */}

            {!service && (

              <div
                className="
                  mb-5
                  flex
                  min-h-[130px]
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-dashed
                  border-pink-200
                  bg-[#fffafb]
                  px-4
                  py-5
                  text-center
                "
              >

                <Sparkles
                  size={24}
                  className="mb-2 text-[#df7f98]"
                />

                <p className="text-sm font-medium text-[#73555f]">
                  No service selected
                </p>

                <p className="mt-1 text-xs leading-5 text-[#a1878e]">
                  Select a service to see your appointment details.
                </p>

              </div>

            )}


            {/* ==========================================
                APPOINTMENT DETAILS
            ========================================== */}

            <div className="space-y-4">

              {/* ========================================
                  SERVICE
              ======================================== */}

              <div className="border-b border-pink-100 pb-4">

                <p className="text-xs text-[#92737c]">
                  Service
                </p>

                <p className="mt-1 break-words font-semibold text-[#4b343b]">
                  {service?.name ||
                    'No service selected'}
                </p>

              </div>


              {/* ========================================
                  DATE
              ======================================== */}

              <div className="border-b border-pink-100 pb-4">

                <p className="text-xs text-[#92737c]">
                  Date
                </p>

                <p className="mt-1 font-semibold text-[#4b343b]">
                  {selectedDate
                    ? selectedDate
                    : 'Select a date'}
                </p>

              </div>


              {/* ========================================
                  TIME
              ======================================== */}

              <div className="border-b border-pink-100 pb-4">

                <p className="text-xs text-[#92737c]">
                  Time
                </p>

                <p className="mt-1 font-semibold text-[#4b343b]">
                  {selectedTime
                    ? selectedTime
                    : 'Select a time'}
                </p>

              </div>


              {/* ========================================
                  SHOP AREA
              ======================================== */}

              <div className="border-b border-pink-100 pb-4">

                <p className="text-xs text-[#92737c]">
                  Shop Area
                </p>

                <p className="mt-1 break-words font-semibold text-[#4b343b]">
                  {selectedArea}
                </p>

              </div>


              {/* ========================================
                  PRICE
              ======================================== */}

              <div>

                <p className="text-xs text-[#92737c]">
                  Total Price
                </p>

                <p className="mt-1 text-2xl font-bold text-[#c18c2d] sm:text-3xl">
                  ₱
                  {service
                    ? service.price.toLocaleString()
                    : '0'}
                </p>

              </div>

            </div>


            {/* ==========================================
                CONFIRM BOOKING
            ========================================== */}

            <button
              type="button"
              onClick={handleBooking}
              disabled={isSubmitting}
              className="
                primary-btn
                mt-7
                w-full
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            >
              {isSubmitting ? 'Booking...' : 'Confirm Booking'}
            </button>


            {/* ==========================================
                REMINDER
            ========================================== */}

            <p className="mt-4 pb-2 text-center text-xs leading-5 text-[#a1878e]">
              Please arrive at least 15 minutes before your appointment.
            </p>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default Booking;