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

import { useEffect, useMemo, useState } from 'react';

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

type ServiceForm = {
  name: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  type: 'Service' | 'Product';
  status: 'Active' | 'Inactive';
};

// ======================================================
// DEFAULT SERVICES
// ======================================================

const defaultServices: ServiceItem[] = [
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
    description:
      'Soft and lightweight lashes suitable for everyday wear.',
    price: 700,
    duration: '1 hr',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Lash Lift',
    category: 'Lash Care',
    description:
      'Natural lash lifting treatment for a curled appearance.',
    price: 600,
    duration: '1 hr',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 6,
    name: 'Lash Tint',
    category: 'Lash Care',
    description:
      'Semi-permanent tint for darker and defined lashes.',
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
    description:
      'Classic manicure with nail cleaning and shaping.',
    price: 350,
    duration: '45 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 8,
    name: 'Basic Pedicure',
    category: 'Nail Services',
    description:
      'Classic pedicure with cleaning and nail shaping.',
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
    description:
      'Natural-looking soft gel nail extensions.',
    price: 1000,
    duration: '2 hrs',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 12,
    name: 'Gel Nail Art',
    category: 'Nail Art',
    description:
      'Customized nail art design using gel polish.',
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
    description:
      'Refreshing facial treatment for basic skin care.',
    price: 600,
    duration: '1 hr',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 14,
    name: 'Deep Cleansing Facial',
    category: 'Facial',
    description:
      'Deep cleansing treatment for congested and oily skin.',
    price: 850,
    duration: '1 hr 15 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 15,
    name: 'Hydrating Facial',
    category: 'Facial',
    description:
      'Moisturizing treatment for dry and dehydrated skin.',
    price: 900,
    duration: '1 hr 15 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 16,
    name: 'Brightening Facial',
    category: 'Facial',
    description:
      'Skin brightening treatment for a fresh and glowing appearance.',
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
    description:
      'Eyebrow shaping and waxing treatment.',
    price: 250,
    duration: '20 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 18,
    name: 'Upper Lip Wax',
    category: 'Waxing',
    description:
      'Quick and gentle upper lip waxing service.',
    price: 200,
    duration: '15 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 19,
    name: 'Underarm Wax',
    category: 'Waxing',
    description:
      'Underarm hair removal using professional waxing products.',
    price: 450,
    duration: '30 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 20,
    name: 'Full Arm Wax',
    category: 'Waxing',
    description:
      'Complete hair removal for both arms.',
    price: 700,
    duration: '45 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 21,
    name: 'Full Leg Wax',
    category: 'Waxing',
    description:
      'Complete hair removal treatment for both legs.',
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
    description:
      'Brow styling treatment for fuller-looking brows.',
    price: 750,
    duration: '1 hr',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 23,
    name: 'Brow Tint',
    category: 'Brows',
    description:
      'Brow tinting treatment for enhanced definition.',
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
    description:
      'Simple makeup application for everyday occasions.',
    price: 800,
    duration: '1 hr',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 25,
    name: 'Event Makeup',
    category: 'Makeup',
    description:
      'Professional makeup application for special events.',
    price: 1500,
    duration: '1 hr 30 min',
    type: 'Service',
    status: 'Active',
  },
  {
    id: 26,
    name: 'Bridal Makeup',
    category: 'Makeup',
    description:
      'Premium makeup service for brides and weddings.',
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
    description:
      'Gentle cleansing shampoo for lash extensions.',
    price: 350,
    duration: '-',
    type: 'Product',
    status: 'Active',
  },
  {
    id: 28,
    name: 'Lash Extension Sealant',
    category: 'Beauty Products',
    description:
      'Aftercare product designed to help maintain lash extensions.',
    price: 450,
    duration: '-',
    type: 'Product',
    status: 'Active',
  },
  {
    id: 29,
    name: 'Cuticle Oil',
    category: 'Nail Care Products',
    description:
      'Moisturizing oil for nails and cuticles.',
    price: 250,
    duration: '-',
    type: 'Product',
    status: 'Active',
  },
  {
    id: 30,
    name: 'Facial Cleanser',
    category: 'Skin Care Products',
    description:
      'Gentle daily facial cleanser.',
    price: 450,
    duration: '-',
    type: 'Product',
    status: 'Active',
  },
  {
    id: 31,
    name: 'Moisturizing Cream',
    category: 'Skin Care Products',
    description:
      'Daily moisturizer for hydrated and healthy-looking skin.',
    price: 550,
    duration: '-',
    type: 'Product',
    status: 'Active',
  },
];

// ======================================================
// EMPTY FORM
// ======================================================

const emptyForm: ServiceForm = {
  name: '',
  category: '',
  description: '',
  price: '',
  duration: '',
  type: 'Service',
  status: 'Active',
};

// ======================================================
// COMPONENT
// ======================================================

function AdminService() {
  const STORAGE_KEY = 'aisha_services';

  // ====================================================
  // STATE
  // ====================================================

  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load services:', error);
    }

    return defaultServices;
  });

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All');

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(
    null
  );

  const [form, setForm] = useState<ServiceForm>(emptyForm);

  const [error, setError] = useState('');

  // ====================================================
  // SAVE TO LOCAL STORAGE
  // ====================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(services)
      );
    } catch (error) {
      console.error('Failed to save services:', error);
    }
  }, [services]);

  // ====================================================
  // CATEGORIES
  // ====================================================

  const categories = useMemo(() => {
    return [
      'All',
      ...Array.from(
        new Set(services.map((service) => service.category))
      ),
    ];
  }, [services]);

  // ====================================================
  // FILTER SERVICES
  // ====================================================

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        service.name.toLowerCase().includes(searchText) ||
        service.category.toLowerCase().includes(searchText) ||
        service.description.toLowerCase().includes(searchText);

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

  // ====================================================
  // OPEN ADD MODAL
  // ====================================================

  const openAddModal = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError('');
    setShowModal(true);
  };

  // ====================================================
  // OPEN EDIT MODAL
  // ====================================================

  const openEditModal = (service: ServiceItem) => {
    setEditingId(service.id);

    setForm({
      name: service.name,
      category: service.category,
      description: service.description,
      price: String(service.price),
      duration: service.duration === '-' ? '' : service.duration,
      type: service.type,
      status: service.status,
    });

    setError('');
    setShowModal(true);
  };

  // ====================================================
  // CLOSE MODAL
  // ====================================================

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    setError('');
  };

  // ====================================================
  // UPDATE FORM
  // ====================================================

  const updateForm = (
    field: keyof ServiceForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ====================================================
  // SAVE SERVICE
  // ====================================================

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError('');

    const name = form.name.trim();
    const categoryValue = form.category.trim();
    const description = form.description.trim();
    const duration =
      form.type === 'Product'
        ? '-'
        : form.duration.trim();

    const price = Number(form.price);

    // ----------------------------------------------
    // VALIDATION
    // ----------------------------------------------

    if (!name) {
      setError('Please enter the service/product name.');
      return;
    }

    if (!categoryValue) {
      setError('Please enter a category.');
      return;
    }

    if (!form.price || Number.isNaN(price) || price < 0) {
      setError('Please enter a valid price.');
      return;
    }

    if (form.type === 'Service' && !duration) {
      setError('Please enter the service duration.');
      return;
    }

    // ----------------------------------------------
    // EDIT EXISTING
    // ----------------------------------------------

    if (editingId !== null) {
      setServices((previous) =>
        previous.map((service) => {
          if (service.id !== editingId) {
            return service;
          }

          return {
            ...service,
            name,
            category: categoryValue,
            description,
            price,
            duration,
            type: form.type,
            status: form.status,
          };
        })
      );

      closeModal();
      return;
    }

    // ----------------------------------------------
    // ADD NEW
    // ----------------------------------------------

    const newId =
      services.length > 0
        ? Math.max(...services.map((item) => item.id)) + 1
        : 1;

    const newService: ServiceItem = {
      id: newId,
      name,
      category: categoryValue,
      description,
      price,
      duration,
      type: form.type,
      status: form.status,
    };

    setServices((previous) => [
      newService,
      ...previous,
    ]);

    closeModal();
  };

  // ====================================================
  // DELETE
  // ====================================================

  const handleDelete = (service: ServiceItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"?`
    );

    if (!confirmed) {
      return;
    }

    setServices((previous) =>
      previous.filter(
        (item) => item.id !== service.id
      )
    );
  };

  // ====================================================
  // TOGGLE STATUS
  // ====================================================

  const toggleStatus = (service: ServiceItem) => {
    setServices((previous) =>
      previous.map((item) => {
        if (item.id !== service.id) {
          return item;
        }

        return {
          ...item,
          status:
            item.status === 'Active'
              ? 'Inactive'
              : 'Active',
        };
      })
    );
  };

  // ====================================================
  // RETURN
  // ====================================================

  return (
    <div className="page-container">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>
          <h1 className="page-title">
            Services & Products
          </h1>

          <p className="mt-1 text-sm text-[#92737c]">
            Manage AishaEsthetics services, treatments,
            and beauty products.
          </p>
        </div>

        {/* ========================================
            ADD SERVICE BUTTON
        ======================================== */}

        <button
          type="button"
          onClick={openAddModal}
          className="
            primary-btn
            flex
            cursor-pointer
            items-center
            justify-center
            gap-2
          "
        >
          <Plus size={18} />
          Add Service
        </button>

      </div>

      {/* ==========================================
          SUMMARY
      ========================================== */}

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
                {
                  services.filter(
                    (item) =>
                      item.type === 'Service'
                  ).length
                }
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
                {
                  services.filter(
                    (item) =>
                      item.type === 'Product'
                  ).length
                }
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
                {
                  services.filter(
                    (item) =>
                      item.status === 'Active'
                  ).length
                }
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* ==========================================
          FILTERS
      ========================================== */}

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

      {/* ==========================================
          SERVICE LIST
      ========================================== */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">

        {/* ========================================
            DESKTOP TABLE
        ======================================== */}

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

                    <button
                      type="button"
                      onClick={() =>
                        toggleStatus(service)
                      }
                      title="Click to change status"
                      className={`
                        cursor-pointer
                        rounded-full
                        px-3
                        py-1
                        text-xs
                        font-semibold
                        transition
                        ${
                          service.status === 'Active'
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }
                      `}
                    >
                      {service.status}
                    </button>

                  </td>

                  {/* ACTION */}

                  <td className="px-5 py-4">

                    <div className="flex gap-2">

                      {/* EDIT */}

                      <button
                        type="button"
                        onClick={() =>
                          openEditModal(service)
                        }
                        className="
                          cursor-pointer
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
                          handleDelete(service)
                        }
                        className="
                          cursor-pointer
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

        {/* ========================================
            MOBILE CARDS
        ======================================== */}

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

                <button
                  type="button"
                  onClick={() =>
                    toggleStatus(service)
                  }
                  className={`
                    cursor-pointer
                    rounded-full
                    px-2
                    py-1
                    text-[10px]
                    font-semibold
                    ${
                      service.status === 'Active'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-gray-100 text-gray-500'
                    }
                  `}
                >
                  {service.status}
                </button>

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
                    onClick={() =>
                      openEditModal(service)
                    }
                    className="
                      cursor-pointer
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
                      handleDelete(service)
                    }
                    className="
                      cursor-pointer
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

              </div>

            </div>

          ))}

        </div>

        {/* ========================================
            NO RESULTS
        ======================================== */}

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

      {/* ==========================================
          FOOTER COUNT
      ========================================== */}

      <p className="mt-4 text-xs text-[#92737c]">
        Showing {filteredServices.length} of{' '}
        {services.length} services and products
      </p>

      {/* ==================================================
          ADD / EDIT MODAL
      ================================================== */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >

          <div
            className="
              relative
              max-h-[90vh]
              w-full
              max-w-2xl
              overflow-y-auto
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >

            {/* ========================================
                MODAL HEADER
            ======================================== */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-pink-100 bg-white px-6 py-4">

              <div>

                <h2 className="text-xl font-bold text-[#4b343b]">
                  {editingId !== null
                    ? 'Edit Service / Product'
                    : 'Add Service / Product'}
                </h2>

                <p className="mt-1 text-xs text-[#92737c]">
                  {editingId !== null
                    ? 'Update the details below.'
                    : 'Enter the details of the new service or product.'}
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="
                  cursor-pointer
                  rounded-lg
                  p-2
                  text-[#92737c]
                  transition
                  hover:bg-[#fff2f4]
                  hover:text-[#d77992]
                "
                title="Close"
              >
                <X size={20} />
              </button>

            </div>

            {/* ========================================
                FORM
            ======================================== */}

            <form
              onSubmit={handleSubmit}
              className="p-6"
            >

              {/* ERROR */}

              {error && (

                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>

              )}

              <div className="grid gap-5 md:grid-cols-2">

                {/* NAME */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-[#4b343b]">
                    Service / Product Name
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateForm(
                        'name',
                        event.target.value
                      )
                    }
                    placeholder="e.g. Classic Lashes"
                    className="input-field w-full"
                    autoFocus
                  />

                </div>

                {/* CATEGORY */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#4b343b]">
                    Category
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    value={form.category}
                    onChange={(event) =>
                      updateForm(
                        'category',
                        event.target.value
                      )
                    }
                    placeholder="e.g. Lash Extensions"
                    className="input-field w-full"
                    list="service-categories"
                  />

                  <datalist id="service-categories">

                    {categories
                      .filter(
                        (item) => item !== 'All'
                      )
                      .map((item) => (
                        <option
                          key={item}
                          value={item}
                        />
                      ))}

                  </datalist>

                </div>

                {/* TYPE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#4b343b]">
                    Type
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    value={form.type}
                    onChange={(event) =>
                      updateForm(
                        'type',
                        event.target.value
                      )
                    }
                    className="input-field w-full"
                  >

                    <option value="Service">
                      Service
                    </option>

                    <option value="Product">
                      Product
                    </option>

                  </select>

                </div>

                {/* PRICE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#4b343b]">
                    Price
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">

                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#92737c]">
                      ₱
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(event) =>
                        updateForm(
                          'price',
                          event.target.value
                        )
                      }
                      placeholder="0.00"
                      className="input-field w-full pl-8"
                    />

                  </div>

                </div>

                {/* DURATION */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#4b343b]">

                    Duration

                    {form.type === 'Service' && (
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    )}

                  </label>

                  <input
                    type="text"
                    value={
                      form.type === 'Product'
                        ? ''
                        : form.duration
                    }
                    onChange={(event) =>
                      updateForm(
                        'duration',
                        event.target.value
                      )
                    }
                    disabled={
                      form.type === 'Product'
                    }
                    placeholder={
                      form.type === 'Product'
                        ? 'Not applicable'
                        : 'e.g. 1 hr 30 min'
                    }
                    className="input-field w-full disabled:cursor-not-allowed disabled:bg-gray-100"
                  />

                </div>

                {/* STATUS */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-[#4b343b]">
                    Status
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm(
                        'status',
                        event.target.value
                      )
                    }
                    className="input-field w-full"
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </div>

                {/* DESCRIPTION */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-[#4b343b]">
                    Description
                  </label>

                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateForm(
                        'description',
                        event.target.value
                      )
                    }
                    placeholder="Enter service or product description..."
                    rows={4}
                    className="
                      input-field
                      w-full
                      resize-none
                    "
                  />

                </div>

              </div>

              {/* ========================================
                  FORM BUTTONS
              ======================================== */}

              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-pink-100 pt-5 sm:flex-row sm:justify-end">

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    cursor-pointer
                    rounded-xl
                    border
                    border-pink-200
                    bg-white
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-[#6d4a54]
                    transition
                    hover:bg-[#fff5f8]
                  "
                >
                  Cancel
                </button>

                {/* SAVE */}

                <button
                  type="submit"
                  className="
                    primary-btn
                    flex
                    cursor-pointer
                    items-center
                    justify-center
                    gap-2
                    px-5
                    py-2.5
                  "
                >

                  <Plus size={18} />

                  {editingId !== null
                    ? 'Save Changes'
                    : 'Save Service'}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminService;