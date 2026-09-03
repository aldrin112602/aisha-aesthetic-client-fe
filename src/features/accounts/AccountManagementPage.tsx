import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import Swal from 'sweetalert2';
import {
  X,
  Trash2,
} from 'lucide-react';

import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from '../../api/users.api';

import {
  getShopAreas,
} from '../../api/shopAreas.api';

import type {
  Employee,
  EmployeeFormData,
  EmployeePayload,
  ShopArea,
} from '../../types';


type Account = Employee;

type AccountFormData =
  EmployeeFormData;

type AccountPayload =
  EmployeePayload;

type RoleFilter =
  | 'All'
  | 'Employee'
  | 'Customer'
  | 'Admin';


const initialFormData: AccountFormData = {
  name: '',
  email: '',
  password: '',
  role: 'Employee',
  shopArea: '',
};


/**
 * Employee and Admin need a shop area.
 * Customer does NOT need a shop area.
 */
const ROLES_REQUIRING_SHOP_AREA = [
  'Employee',
  'Admin',
];


const ROLE_FILTERS: RoleFilter[] = [
  'All',
  'Employee',
  'Customer',
  'Admin',
];


function AccountManagement() {

  // ============================================================
  // ACCOUNTS
  // ============================================================

  const [accounts, setAccounts] =
    useState<Account[]>([]);

  const [loading, setLoading] =
    useState(true);


  // ============================================================
  // ROLE FILTER
  // ============================================================

  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>('All');


  /**
   * IMPORTANT:
   *
   * Backend stores roles in lowercase:
   * employee
   * customer
   * admin
   *
   * UI uses:
   * Employee
   * Customer
   * Admin
   *
   * Therefore comparison MUST be case-insensitive.
   */
  const filteredAccounts = useMemo(() => {

    if (roleFilter === 'All') {
      return accounts;
    }

    return accounts.filter(
      (account) =>
        String(account.role)
          .trim()
          .toLowerCase() ===
        roleFilter
          .trim()
          .toLowerCase()
    );

  }, [
    accounts,
    roleFilter,
  ]);


  // ============================================================
  // SHOP AREAS
  // ============================================================

  const [shopAreas, setShopAreas] =
    useState<ShopArea[]>([]);

  const [loadingShopAreas, setLoadingShopAreas] =
    useState(true);


  // ============================================================
  // MODAL
  // ============================================================

  const [showModal, setShowModal] =
    useState(false);

  const [isEditing, setIsEditing] =
    useState(false);

  const [editingId, setEditingId] =
    useState<number | null>(null);


  // ============================================================
  // FORM
  // ============================================================

  const [formData, setFormData] =
    useState<AccountFormData>(
      initialFormData
    );


  const shopAreaRequired =
    ROLES_REQUIRING_SHOP_AREA.includes(
      formData.role
    );


  // ============================================================
  // MESSAGES
  // ============================================================

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');


  // ============================================================
  // FETCH ALL ACCOUNTS
  // ============================================================

  const fetchAccounts =
    useCallback(async () => {

      try {

        setLoading(true);
        setError('');

        /**
         * IMPORTANT:
         *
         * We use getUsers()
         * instead of getEmployees().
         *
         * This loads:
         * - Employees
         * - Customers
         * - Admins
         */

        const data =
          await getUsers();

        setAccounts(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        console.error(
          'Failed to fetch accounts:',
          err
        );

        setAccounts([]);

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load accounts.'
        );

      } finally {

        setLoading(false);

      }

    }, []);


  // ============================================================
  // FETCH SHOP AREAS
  // ============================================================

  const fetchShopAreas =
    useCallback(async () => {

      try {

        setLoadingShopAreas(true);

        const data =
          await getShopAreas();

        setShopAreas(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (err) {

        console.error(
          'Failed to fetch shop areas:',
          err
        );

        setShopAreas([]);

      } finally {

        setLoadingShopAreas(false);

      }

    }, []);


  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {

    queueMicrotask(() => {

      void fetchAccounts();

      void fetchShopAreas();

    });

  }, [
    fetchAccounts,
    fetchShopAreas,
  ]);


  // ============================================================
  // OPEN ADD MODAL
  // ============================================================

  const handleOpenModal = () => {

    setIsEditing(false);

    setEditingId(null);

    setFormData({
      ...initialFormData,

      /**
       * Automatically select
       * first shop area for Employee.
       */
      shopArea:
        shopAreas.length > 0
          ? shopAreas[0].name
          : '',
    });

    setError('');

    setSuccess('');

    setShowModal(true);

  };


  // ============================================================
  // EDIT ACCOUNT
  // ============================================================

  const handleEditAccount =
    (account: Account) => {

      setIsEditing(true);

      setEditingId(account.id);

      /**
       * Convert backend role
       * to UI role format.
       */
      const normalizedRole =
        String(account.role)
          .trim()
          .toLowerCase();

      let displayRole:
        | 'Employee'
        | 'Customer'
        | 'Admin' = 'Customer';

      if (
        normalizedRole ===
        'employee'
      ) {

        displayRole = 'Employee';

      } else if (
        normalizedRole ===
        'admin'
      ) {

        displayRole = 'Admin';

      } else {

        displayRole = 'Customer';

      }


      setFormData({

        name:
          account.name || '',

        email:
          account.email || '',

        password:
          '',

        role:
          displayRole,

        shopArea:
          account.shopArea || '',

      });

      setError('');

      setSuccess('');

      setShowModal(true);

    };


  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const handleCloseModal = () => {

    setShowModal(false);

    setFormData({
      ...initialFormData,
    });

    setError('');

    setSuccess('');

    setEditingId(null);

    setIsEditing(false);

  };


  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >
  ) => {

    const {
      name,
      value,
    } = e.target;


    setFormData(
      (prev) => ({

        ...prev,

        [name]: value,


        /**
         * Customer does not need
         * a shop area.
         *
         * When changing Employee/Admin
         * to Customer, clear shopArea.
         */
        ...(name === 'role' &&
          !ROLES_REQUIRING_SHOP_AREA.includes(
            value
          )
          ? {
            shopArea: '',
          }
          : {}),

      })
    );

  };


  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError('');

    setSuccess('');


    // ==========================================================
    // VALIDATE NAME
    // ==========================================================

    if (
      !formData.name.trim()
    ) {

      setError(
        'Please enter the account name.'
      );

      return;

    }


    // ==========================================================
    // VALIDATE EMAIL
    // ==========================================================

    if (
      !formData.email.trim()
    ) {

      setError(
        'Please enter the account email.'
      );

      return;

    }


    // ==========================================================
    // VALIDATE PASSWORD
    // ==========================================================

    if (
      !isEditing &&
      !formData.password.trim()
    ) {

      setError(
        'Password is required for new accounts.'
      );

      return;

    }


    // ==========================================================
    // VALIDATE SHOP AREA
    // ==========================================================

    if (
      shopAreaRequired &&
      !formData.shopArea
    ) {

      setError(
        'Please select a shop / area for this role.'
      );

      return;

    }


    try {

      /**
       * UI role:
       *
       * Employee
       * Customer
       * Admin
       *
       * Backend receives lowercase:
       *
       * employee
       * customer
       * admin
       */
      const normalizedRole =
        formData.role
          .trim()
          .toLowerCase();


      /**
       * Customer:
       * shopArea = null
       *
       * Employee/Admin:
       * shopArea = selected shop area
       */
      const finalShopArea =
        shopAreaRequired
          ? formData.shopArea
          : null;


      const payload:
        AccountPayload = {
        name:
          formData.name.trim(),

        email:
          formData.email
            .trim()
            .toLowerCase(),

        role:
          normalizedRole,

        shopArea:
          finalShopArea as any,
      };


      // ========================================================
      // UPDATE
      // ========================================================

      if (
        isEditing &&
        editingId !== null
      ) {

        /**
         * Password is optional when editing.
         */
        if (
          formData.password.trim()
        ) {

          payload.password =
            formData.password;

        }


        await updateUser(
          editingId,
          payload
        );


        setSuccess(
          'Account updated successfully!'
        );

      }


      // ========================================================
      // CREATE
      // ========================================================

      else {

        payload.password =
          formData.password;


        await createUser(
          payload
        );


        setSuccess(
          'Account added successfully!'
        );

      }


      // ========================================================
      // RESET FORM
      // ========================================================

      setFormData({
        ...initialFormData,
      });


      // ========================================================
      // REFRESH ACCOUNTS
      // ========================================================

      setTimeout(() => {

        setShowModal(false);

        setEditingId(null);

        setIsEditing(false);

        void fetchAccounts();

      }, 800);

    } catch (err) {

      console.error(
        'Save account error:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to save account.'
      );

    }

  };


  // ============================================================
  // DELETE ACCOUNT
  // ============================================================

  const handleDeleteAccount =
    async (
      id: number,
      name: string
    ) => {



      const result = await Swal.fire({
        title: 'Delete Account?',
        text: `Are you sure you want to delete ${name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Delete',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#c1433f',
        cancelButtonColor: '#9ca3af',
        reverseButtons: true,
        focusCancel: true,
      });

      if (!result.isConfirmed) {
        return;
      }


      try {

        setError('');

        setSuccess('');

        await deleteUser(id);


        setSuccess(
          'Account deleted successfully!'
        );


        await fetchAccounts();


        setTimeout(() => {

          setSuccess('');

        }, 2000);

      } catch (err) {

        console.error(
          'Delete account error:',
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : 'Failed to delete account.'
        );

      }

    };


  // ============================================================
  // STATUS COLOR
  // ============================================================

  const getStatusColor =
    (status: string) => {

      switch (
      status
        ?.toLowerCase()
      ) {

        case 'active':

          return 'bg-[#edf9f1] text-[#2f7d59]';


        case 'on leave':

          return 'bg-[#fff5df] text-[#b88a2c]';


        case 'inactive':

          return 'bg-[#fee5e5] text-[#c1433f]';


        default:

          return 'bg-[#edf9f1] text-[#2f7d59]';

      }

    };


  // ============================================================
  // ROLE COLOR
  // ============================================================

  const getRoleColor =
    (role: string) => {

      switch (
      role
        ?.trim()
        .toLowerCase()
      ) {

        case 'admin':

          return 'bg-[#f1e9fb] text-[#6b3fa0]';


        case 'employee':

          return 'bg-[#e6f0fb] text-[#2f5f9e]';


        case 'customer':

          return 'bg-[#fdf0e6] text-[#a05a2f]';


        default:

          return 'bg-[#f0f0f0] text-[#555]';

      }

    };


  // ============================================================
  // DISPLAY ROLE
  // ============================================================

  const getDisplayRole =
    (role: string) => {

      switch (
      role
        ?.trim()
        .toLowerCase()
      ) {

        case 'admin':

          return 'Admin';


        case 'employee':

          return 'Employee';


        case 'customer':

          return 'Customer';


        default:

          return role;

      }

    };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <div className="page-container">


      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="mb-6 flex items-center justify-between gap-3">

        <div>

          <h1 className="page-title">
            Account Management
          </h1>

          <p className="page-subtitle">
            Manage employee, customer, and admin
            accounts, roles, and assigned shop areas.
          </p>

        </div>


        <button
          type="button"
          onClick={handleOpenModal}
          className="primary-btn"
        >
          Add Account
        </button>

      </div>


      {/* ========================================================
          SUCCESS / ERROR
      ======================================================== */}

      {error && !showModal && (

        <div className="mb-4 rounded-lg bg-[#fee5e5] p-3 text-sm text-[#c1433f]">
          {error}
        </div>

      )}


      {success && !showModal && (

        <div className="mb-4 rounded-lg bg-[#edf9f1] p-3 text-sm text-[#2f7d59]">
          {success}
        </div>

      )}


      {/* ========================================================
          ROLE FILTER
      ======================================================== */}

      <div className="mb-4 flex flex-wrap gap-2">

        {ROLE_FILTERS.map(
          (role) => {

            const count =
              role === 'All'
                ? accounts.length
                : accounts.filter(
                  (account) =>
                    String(
                      account.role
                    )
                      .trim()
                      .toLowerCase() ===
                    role
                      .trim()
                      .toLowerCase()
                ).length;


            return (

              <button
                type="button"
                key={role}
                onClick={() =>
                  setRoleFilter(role)
                }
                className={`
                  rounded-full
                  px-4
                  py-1.5
                  text-xs
                  font-semibold
                  transition-colors
                  ${roleFilter === role
                    ? 'bg-[#df7f98] text-white'
                    : 'border border-pink-100 bg-white text-[#7c5b63] hover:bg-[#fff4f6]'
                  }
                `}
              >

                {role}

                {role !== 'All' && (

                  <span className="ml-1 opacity-70">
                    ({count})
                  </span>

                )}

              </button>

            );

          }
        )}

      </div>


      {/* ========================================================
          ACCOUNT TABLE
      ======================================================== */}

      {loading ? (

        <div className="rounded-2xl border border-pink-100 bg-white p-6 text-center text-sm text-[#7c5b63]">
          Loading accounts...
        </div>

      ) : filteredAccounts.length === 0 ? (

        <div className="rounded-2xl border border-dashed border-pink-200 bg-white p-6 text-center text-sm text-[#7c5b63]">

          {accounts.length === 0
            ? 'No accounts found. Click "Add Account" to get started.'
            : `No ${roleFilter.toLowerCase()} accounts found.`}

        </div>

      ) : (

        <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="min-w-full text-left text-sm">

              <thead className="bg-[#fff4f6] text-[#5b3e45]">

                <tr>

                  <th className="px-4 py-3 font-semibold">
                    Name
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Email
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Role
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Shop / Area
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Status
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredAccounts.map(
                  (account) => (

                    <tr
                      key={account.id}
                      className="border-t border-pink-100"
                    >

                      <td className="px-4 py-3 font-medium text-[#4b343b]">
                        {account.name}
                      </td>


                      <td className="px-4 py-3 text-[#666]">
                        {account.email}
                      </td>


                      <td className="px-4 py-3">

                        <span
                          className={`
                            rounded-full
                            px-2.5
                            py-1
                            text-xs
                            font-semibold
                            ${getRoleColor(
                            account.role
                          )}
                          `}
                        >
                          {getDisplayRole(
                            account.role
                          )}
                        </span>

                      </td>


                      <td className="px-4 py-3 text-[#666]">

                        {account.shopArea ||
                          '-'}

                      </td>


                      <td className="px-4 py-3">

                        <span
                          className={`
                            rounded-full
                            px-2.5
                            py-1
                            text-xs
                            font-semibold
                            uppercase
                            ${getStatusColor(
                            account.status
                          )}
                          `}
                        >
                          {account.status}
                        </span>

                      </td>


                      <td className="px-4 py-3">

                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEditAccount(
                                account
                              )
                            }
                            className="secondary-btn px-3 py-2 text-xs"
                          >
                            Edit
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteAccount(
                                account.id,
                                account.name
                              )
                            }
                            className="flex items-center gap-1 rounded-lg bg-[#fee5e5] px-3 py-2 text-xs font-semibold text-[#c1433f] hover:bg-[#fdd5d5]"
                          >

                            <Trash2
                              size={14}
                            />

                            Delete

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      )}


      {/* ========================================================
          ADD / EDIT MODAL
      ======================================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            {/* ==================================================
                MODAL HEADER
            ================================================== */}

            <div className="mb-4 flex items-center justify-between">

              <h2 className="text-xl font-bold text-[#4b343b]">

                {isEditing
                  ? 'Edit Account'
                  : 'Add New Account'}

              </h2>


              <button
                type="button"
                onClick={handleCloseModal}
                className="text-[#999] hover:text-[#666]"
              >

                <X size={24} />

              </button>

            </div>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

              <div className="mb-4 rounded-lg bg-[#fee5e5] p-3 text-sm text-[#c1433f]">
                {error}
              </div>

            )}


            {/* ==================================================
                SUCCESS
            ================================================== */}

            {success && (

              <div className="mb-4 rounded-lg bg-[#edf9f1] p-3 text-sm text-[#2f7d59]">
                {success}
              </div>

            )}


            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* NAME */}

              <div>

                <label className="block text-sm font-semibold text-[#4b343b]">
                  Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={
                    handleInputChange
                  }
                  placeholder="Account name"
                  className="mt-2 w-full rounded-lg border border-pink-100 bg-[#fffafb] px-4 py-2 text-sm outline-none focus:border-[#df7f98]"
                  required
                />

              </div>


              {/* EMAIL */}

              <div>

                <label className="block text-sm font-semibold text-[#4b343b]">
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={
                    handleInputChange
                  }
                  placeholder="account@aisha.com"
                  className="mt-2 w-full rounded-lg border border-pink-100 bg-[#fffafb] px-4 py-2 text-sm outline-none focus:border-[#df7f98]"
                  required
                />

              </div>


              {/* PASSWORD */}

              <div>

                <label className="block text-sm font-semibold text-[#4b343b]">

                  {isEditing
                    ? 'Password'
                    : 'Password *'}

                </label>

                <input
                  type="password"
                  name="password"
                  value={
                    formData.password
                  }
                  onChange={
                    handleInputChange
                  }
                  placeholder={
                    isEditing
                      ? 'Leave blank to keep current password'
                      : 'Enter password'
                  }
                  className="mt-2 w-full rounded-lg border border-pink-100 bg-[#fffafb] px-4 py-2 text-sm outline-none focus:border-[#df7f98]"
                  required={!isEditing}
                />

              </div>


              {/* ROLE */}

              <div>

                <label className="block text-sm font-semibold text-[#4b343b]">
                  Role *
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={
                    handleInputChange
                  }
                  className="mt-2 w-full rounded-lg border border-pink-100 bg-[#fffafb] px-4 py-2 text-sm outline-none focus:border-[#df7f98]"
                  required
                >

                  <option value="Employee">
                    Employee
                  </option>

                  <option value="Customer">
                    Customer
                  </option>

                  <option value="Admin">
                    Admin
                  </option>

                </select>

              </div>


              {/* SHOP AREA */}

              {shopAreaRequired && (

                <div>

                  <label className="block text-sm font-semibold text-[#4b343b]">
                    Shop / Area *
                  </label>

                  <select
                    name="shopArea"
                    value={
                      formData.shopArea
                    }
                    onChange={
                      handleInputChange
                    }
                    disabled={
                      loadingShopAreas ||
                      shopAreas.length === 0
                    }
                    className="mt-2 w-full rounded-lg border border-pink-100 bg-[#fffafb] px-4 py-2 text-sm outline-none focus:border-[#df7f98] disabled:cursor-not-allowed disabled:opacity-60"
                    required
                  >

                    {loadingShopAreas ? (

                      <option value="">
                        Loading shop areas...
                      </option>

                    ) : shopAreas.length === 0 ? (

                      <option value="">
                        No shop area available
                      </option>

                    ) : (

                      <>
                        <option value="">
                          Select shop / area
                        </option>

                        {shopAreas.map(
                          (area) => (

                            <option
                              key={area.id}
                              value={area.name}
                            >
                              {area.name}
                            </option>

                          )
                        )}
                      </>

                    )}

                  </select>


                  {!loadingShopAreas &&
                    shopAreas.length === 0 && (

                      <p className="mt-2 text-xs text-[#c1433f]">
                        Please create a shop
                        area first in Shop Areas.
                      </p>

                    )}

                </div>

              )}


              {/* BUTTONS */}

              <div className="flex gap-3 pt-4">

                <button
                  type="button"
                  onClick={
                    handleCloseModal
                  }
                  className="secondary-btn flex-1 py-2"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={
                    shopAreaRequired &&
                    (
                      loadingShopAreas ||
                      shopAreas.length === 0
                    )
                  }
                  className="primary-btn flex-1 py-2 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {isEditing
                    ? 'Update Account'
                    : 'Add Account'}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );
}


export default AccountManagement;