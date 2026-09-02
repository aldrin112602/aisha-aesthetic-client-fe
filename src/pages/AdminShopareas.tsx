import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  Heart,
  Flower2,
  Scissors,
  Package,
  Clock3,
  X,
} from 'lucide-react';

import { useMemo, useState } from 'react';

type ServiceItem = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  type: 'Service' | 'Product';
  status: 'Active' | 'Inactive';
};

const initialServices: ServiceItem[] = [
  // ==========================================
  // LASH SERVICES
  // ==========================================

  {
    id: 1,
    name: 'Classic Lashes',
    category: 'Lash Extensions',
    description: 'Natural-looking individual lash extensions.',
    price: 800,
    duration: '1 hr 30 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Hybrid Lashes',
    category: 'Lash Extensions',
    description: 'Combination of classic and volume lash extensions.',
    price: 1000,
    duration: '1 hr 45 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Russian Lashes',
    category: 'Lash Extensions',
    description: 'Full and dramatic lightweight volume lashes.',
    price: 1200,
    duration: '2 hrs',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Daily Wear Lashes',
    category: 'Lash Extensions',
    description: 'Soft and lightweight lashes suitable for everyday wear.',
    price: 700,
    duration: '1 hr',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Lash Lift',
    category: 'Lash Care',
    description: 'Natural lash lifting treatment for a curled appearance.',
    price: 600,
    duration: '1 hr',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 6,
    name: 'Lash Tint',
    category: 'Lash Care',
    description: 'Semi-permanent tint for darker and defined lashes.',
    price: 400,
    duration: '45 min',
    type: 'Service',
    status: 'Active',
  },

  // ==========================================
  // NAIL SERVICES
  // ==========================================

  {
    id: 7,
    name: 'Basic Manicure',
    category: 'Nail Services',
    description: 'Classic manicure with nail cleaning and shaping.',
    price: 350,
    duration: '45 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 8,
    name: 'Basic Pedicure',
    category: 'Nail Services',
    description: 'Classic pedicure with cleaning and nail shaping.',
    price: 400,
    duration: '1 hr',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 9,
    name: 'Gel Manicure',
    category: 'Nail Services',
    description: 'Long-lasting gel polish manicure.',
    price: 650,
    duration: '1 hr 15 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 10,
    name: 'Gel Pedicure',
    category: 'Nail Services',
    description: 'Long-lasting gel polish pedicure.',
    price: 700,
    duration: '1 hr 15 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 11,
    name: 'Soft Gel Extensions',
    category: 'Nail Extensions',
    description: 'Natural-looking soft gel nail extensions.',
    price: 1000,
    duration: '2 hrs',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 12,
    name: 'Gel Nail Art',
    category: 'Nail Art',
    description: 'Customized nail art design using gel polish.',
    price: 850,
    duration: '1 hr 30 min',
    type: 'Service',
    status: 'Active',
  },

  // ==========================================
  // FACIAL SERVICES
  // ==========================================

  {
    id: 13,
    name: 'Basic Facial',
    category: 'Facial',
    description: 'Refreshing facial treatment for basic skin care.',
    price: 600,
    duration: '1 hr',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 14,
    name: 'Deep Cleansing Facial',
    category: 'Facial',
    description: 'Deep cleansing treatment for congested and oily skin.',
    price: 850,
    duration: '1 hr 15 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 15,
    name: 'Hydrating Facial',
    category: 'Facial',
    description: 'Moisturizing treatment for dry and dehydrated skin.',
    price: 900,
    duration: '1 hr 15 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 16,
    name: 'Brightening Facial',
    category: 'Facial',
    description: 'Skin brightening treatment for a fresh and glowing appearance.',
    price: 950,
    duration: '1 hr 15 min',
    type: 'Service',
    status: 'Active',
  },

  // ==========================================
  // WAXING
  // ==========================================

  {
    id: 17,
    name: 'Eyebrow Wax',
    category: 'Waxing',
    description: 'Eyebrow shaping and waxing treatment.',
    price: 250,
    duration: '20 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 18,
    name: 'Upper Lip Wax',
    category: 'Waxing',
    description: 'Quick and gentle upper lip waxing service.',
    price: 200,
    duration: '15 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 19,
    name: 'Underarm Wax',
    category: 'Waxing',
    description: 'Underarm hair removal using professional waxing products.',
    price: 450,
    duration: '30 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 20,
    name: 'Full Arm Wax',
    category: 'Waxing',
    description: 'Complete hair removal for both arms.',
    price: 700,
    duration: '45 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 21,
    name: 'Full Leg Wax',
    category: 'Waxing',
    description: 'Complete hair removal treatment for both legs.',
    price: 1000,
    duration: '1 hr',
    type: 'Service',
    status: 'Active',
  },

  // ==========================================
  // BROW SERVICES
  // ==========================================

  {
    id: 22,
    name: 'Brow Lamination',
    category: 'Brows',
    description: 'Brow styling treatment for fuller-looking brows.',
    price: 750,
    duration: '1 hr',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 23,
    name: 'Brow Tint',
    category: 'Brows',
    description: 'Brow tinting treatment for enhanced definition.',
    price: 450,
    duration: '30 min',
    type: 'Service',
    status: 'Active',
  },

  // ==========================================
  // MAKEUP
  // ==========================================

  {
    id: 24,
    name: 'Basic Makeup',
    category: 'Makeup',
    description: 'Simple makeup application for everyday occasions.',
    price: 800,
    duration: '1 hr',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 25,
    name: 'Event Makeup',
    category: 'Makeup',
    description: 'Professional makeup application for special events.',
    price: 1500,
    duration: '1 hr 30 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 26,
    name: 'Bridal Makeup',
    category: 'Makeup',
    description: 'Premium makeup service for brides and weddings.',
    price: 2500,
    duration: '2 hrs',
    type: 'Service',
    status: 'Active',
  },

  // ==========================================
  // BEAUTY PRODUCTS
  // ==========================================

  {
    id: 27,
    name: 'Lash Shampoo',
    category: 'Beauty Products',
    description: 'Gentle cleansing shampoo for lash extensions.',
    price: 350,
    duration: '-',
    type: 'Product',
    status: 'Active',
  },
  {
    id: 28,
    name: 'Lash Extension Sealant',
    category: 'Beauty Products',
    description: 'Aftercare product designed to help maintain lash extensions.',
    price: 450,
    duration: '-',
    type: 'Product',
    status: 'Active',
  },
  {
    id: 29,
    name: 'Cuticle Oil',
    category: 'Nail Care Products',
    description: 'Moisturizing oil for nails and cuticles.',
    price: 250,
    duration: '-',
    type: 'Product',
    status: 'Active',
  },
  {
    id: 30,
    name: 'Facial Cleanser',
    category: 'Skin Care Products',
    description: 'Gentle daily facial cleanser.',
    price: 450,
    duration: '-',
    type: 'Product',
    status: 'Active',
  },
  {
    id: 31,
    name: 'Moisturizing Cream',
    category: 'Skin Care Products',
    description: 'Daily moisturizer for hydrated and healthy-looking skin.',
    price: 550,
    duration: '-',
    type: 'Product',
    status: 'Active',
  },
];

function AdminService() {
  const [services, setServices] =
    useState<ServiceItem[]>(initialServices);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All');

  // ============================================================
  // DELETE MODAL STATE
  // ============================================================

  const [deleteTarget, setDeleteTarget] =
    useState<ServiceItem | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  // ============================================================
  // CATEGORIES
  // ============================================================

  const categories = [
    'All',
    ...Array.from(
      new Set(
        services.map((service) => service.category)
      )
    ),
  ];

  // ============================================================
  // FILTER
  // ============================================================

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        service.name
          .toLowerCase()
          .includes(searchValue) ||
        service.category
          .toLowerCase()
          .includes(searchValue) ||
        service.description
          .toLowerCase()
          .includes(searchValue);

      const matchesCategory =
        category === 'All' ||
        service.category === category;

      const matchesType =
        type === 'All' ||
        service.type === type;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType
      );
    });
  }, [services, search, category, type]);

  // ============================================================
  // OPEN DELETE MODAL
  // ============================================================

  const handleDeleteClick = (
    service: ServiceItem
  ) => {
    setDeleteTarget(service);
  };

  // ============================================================
  // CLOSE DELETE MODAL
  // ============================================================

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setDeleteTarget(null);
  };

  // ============================================================
  // CONFIRM DELETE
  // ============================================================

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      // Remove service from the current data
      setServices((currentServices) =>
        currentServices.filter(
          (service) =>
            service.id !== deleteTarget.id
        )
      );

      // Close modal
      setDeleteTarget(null);

    } catch (error) {
      console.error(
        'Failed to delete service:',
        error
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // ============================================================
  // TOTAL COUNTS
  // ============================================================

  const totalServices = services.filter(
    (item) => item.type === 'Service'
  ).length;

  const totalProducts = services.filter(
    (item) => item.type === 'Product'
  ).length;

  const totalActive = services.filter(
    (item) => item.status === 'Active'
  ).length;

  return (
    <div className="page-container">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="page-title">
            Services & Products
          </h1>

          <p className="mt-1 text-sm text-[#92737c]">
            Manage AishaEsthetics services,
            treatments, and beauty products.
          </p>
        </div>

        <button
          type="button"
          className="
            primary-btn
            flex
            items-center
            justify-center
            gap-2
          "
        >
          <Plus size={18} />
          Add Service
        </button>

      </div>

      {/* ========================================================
          SUMMARY CARDS
      ======================================================== */}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* TOTAL SERVICES */}

        <div className="pink-card">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff2df] text-[#c18c2d]">
              <Sparkles size={20} />
            </div>

            <div>

              <p className="text-xs text-[#92737c]">
                Total Services
              </p>

              <p className="text-2xl font-bold text-[#4b343b]">
                {totalServices}
              </p>

            </div>

          </div>

        </div>

        {/* PRODUCTS */}

        <div className="pink-card">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff2f4] text-[#d77992]">
              <Package size={20} />
            </div>

            <div>

              <p className="text-xs text-[#92737c]">
                Products
              </p>

              <p className="text-2xl font-bold text-[#4b343b]">
                {totalProducts}
              </p>

            </div>

          </div>

        </div>

        {/* CATEGORIES */}

        <div className="pink-card">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3ecff] text-[#8666a8]">
              <Flower2 size={20} />
            </div>

            <div>

              <p className="text-xs text-[#92737c]">
                Categories
              </p>

              <p className="text-2xl font-bold text-[#4b343b]">
                {categories.length - 1}
              </p>

            </div>

          </div>

        </div>

        {/* ACTIVE */}

        <div className="pink-card">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eaf8f2] text-[#4d9a72]">
              <Heart size={20} />
            </div>

            <div>

              <p className="text-xs text-[#92737c]">
                Active
              </p>

              <p className="text-2xl font-bold text-[#4b343b]">
                {totalActive}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================
          FILTERS
      ======================================================== */}

      <div className="mt-6 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">

        <div className="grid gap-4 md:grid-cols-3">

          {/* SEARCH */}

          <div className="relative">

            <Search
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-[#b49aa2]
              "
            />

            <input
              type="text"
              placeholder="Search services or products..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="
                input-field
                w-full
                pl-10
              "
            />

          </div>

          {/* CATEGORY */}

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="input-field w-full"
          >
            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}
          </select>

          {/* TYPE */}

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value)
            }
            className="input-field w-full"
          >
            <option value="All">
              All Types
            </option>

            <option value="Service">
              Services
            </option>

            <option value="Product">
              Products
            </option>
          </select>

        </div>

      </div>

      {/* ========================================================
          SERVICE LIST
      ======================================================== */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">

        {/* ======================================================
            DESKTOP TABLE
        ====================================================== */}

        <div className="hidden overflow-x-auto md:block">

          <table className="w-full text-left">

            <thead className="border-b border-pink-100 bg-[#fff8fa]">

              <tr>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                  Service / Product
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                  Category
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                  Type
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                  Price
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                  Duration
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#92737c]">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredServices.map((service) => (

                <tr
                  key={service.id}
                  className="
                    border-b
                    border-pink-50
                    last:border-0
                    hover:bg-[#fffafa]
                  "
                >

                  {/* SERVICE */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff2f4] text-[#d77992]">

                        {service.type === 'Product' ? (
                          <Package size={18} />
                        ) : (
                          <Sparkles size={18} />
                        )}

                      </div>

                      <div>

                        <p className="font-semibold text-[#4b343b]">
                          {service.name}
                        </p>

                        <p className="mt-1 max-w-xs text-xs text-[#92737c]">
                          {service.description}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* CATEGORY */}

                  <td className="px-5 py-4 text-sm text-[#6d4a54]">
                    {service.category}
                  </td>

                  {/* TYPE */}

                  <td className="px-5 py-4">

                    <span
                      className={`
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        ${
                          service.type === 'Service'
                            ? 'bg-[#fff2f4] text-[#d77992]'
                            : 'bg-[#fff2df] text-[#b88a2c]'
                        }
                      `}
                    >
                      {service.type}
                    </span>

                  </td>

                  {/* PRICE */}

                  <td className="px-5 py-4 text-sm font-bold text-[#c18c2d]">
                    ₱{service.price.toLocaleString()}
                  </td>

                  {/* DURATION */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2 text-sm text-[#6d4a54]">

                      {service.duration !== '-' && (
                        <Clock3 size={15} />
                      )}

                      {service.duration}

                    </div>

                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-4">

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                      {service.status}
                    </span>

                  </td>

                  {/* ACTION */}

                  <td className="px-5 py-4">

                    <div className="flex gap-2">

                      {/* EDIT */}

                      <button
                        type="button"
                        className="
                          rounded-lg
                          bg-[#fff5f8]
                          p-2
                          text-[#d77992]
                          transition
                          hover:bg-[#ffdce6]
                        "
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteClick(service)
                        }
                        className="
                          rounded-lg
                          bg-red-50
                          p-2
                          text-red-500
                          transition
                          hover:bg-red-100
                        "
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* ======================================================
            MOBILE CARDS
        ====================================================== */}

        <div className="space-y-3 p-4 md:hidden">

          {filteredServices.map((service) => (

            <div
              key={service.id}
              className="
                rounded-xl
                border
                border-pink-100
                p-4
              "
            >

              <div className="flex items-start justify-between gap-3">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff2f4] text-[#d77992]">

                    {service.type === 'Product' ? (
                      <Package size={18} />
                    ) : (
                      <Sparkles size={18} />
                    )}

                  </div>

                  <div>

                    <p className="font-semibold text-[#4b343b]">
                      {service.name}
                    </p>

                    <p className="text-xs text-[#92737c]">
                      {service.category}
                    </p>

                  </div>

                </div>

                <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-600">
                  {service.status}
                </span>

              </div>

              <p className="mt-3 text-sm text-[#80656d]">
                {service.description}
              </p>

              <div className="mt-4 flex items-center justify-between">

                <div>

                  <p className="text-lg font-bold text-[#c18c2d]">
                    ₱{service.price.toLocaleString()}
                  </p>

                  {service.duration !== '-' && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-[#92737c]">
                      <Clock3 size={13} />
                      {service.duration}
                    </p>
                  )}

                </div>

                <div className="flex gap-2">

                  {/* EDIT */}

                  <button
                    type="button"
                    className="
                      rounded-lg
                      bg-[#fff5f8]
                      p-2
                      text-[#d77992]
                    "
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>

                  {/* DELETE */}

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteClick(service)
                    }
                    className="
                      rounded-lg
                      bg-red-50
                      p-2
                      text-red-500
                    "
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* ======================================================
            NO RESULTS
        ====================================================== */}

        {filteredServices.length === 0 && (

          <div className="p-10 text-center">

            <Scissors
              size={36}
              className="mx-auto text-[#d9b9c2]"
            />

            <p className="mt-3 font-semibold text-[#4b343b]">
              No services or products found
            </p>

            <p className="mt-1 text-sm text-[#92737c]">
              Try changing your search or filters.
            </p>

          </div>

        )}

      </div>

      {/* ========================================================
          FOOTER COUNT
      ======================================================== */}

      <p className="mt-4 text-xs text-[#92737c]">
        Showing {filteredServices.length} of{' '}
        {services.length} services and products
      </p>

      {/* ========================================================
          DELETE CONFIRMATION MODAL
      ======================================================== */}

      {deleteTarget && (

        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/40
            px-4
          "
          onClick={() => {
            if (!isDeleting) {
              setDeleteTarget(null);
            }
          }}
        >

          <div
            className="
              w-full
              max-w-[360px]
              rounded-2xl
              bg-white
              px-6
              py-5
              text-center
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* ==================================================
                TRASH ICON
            ================================================== */}

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">

              <Trash2
                size={52}
                strokeWidth={1.5}
                className="text-red-500"
              />

            </div>

            {/* ==================================================
                TITLE
            ================================================== */}

            <h2 className="text-[17px] font-bold leading-6 text-[#172033]">

              Are you sure you want to
              <br />
              delete this service?

            </h2>

            {/* ==================================================
                SERVICE NAME
            ================================================== */}

            <p className="mt-3 break-words text-[12px] text-[#6f7785]">

              "{deleteTarget.name}"

            </p>

            {/* ==================================================
                BUTTONS
            ================================================== */}

            <div className="mt-5 grid grid-cols-2 gap-3">

              {/* CANCEL */}

              <button
                type="button"
                disabled={isDeleting}
                onClick={() =>
                  setDeleteTarget(null)
                }
                className="
                  rounded-lg
                  border
                  border-[#d9dce2]
                  bg-white
                  px-4
                  py-2.5
                  text-[13px]
                  font-medium
                  text-[#4b5563]
                  transition
                  hover:bg-gray-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              {/* DELETE */}

              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="
                  rounded-lg
                  bg-red-500
                  px-4
                  py-2.5
                  text-[13px]
                  font-semibold
                  text-white
                  transition
                  hover:bg-red-600
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isDeleting
                  ? 'Deleting...'
                  : 'Delete'}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminService;