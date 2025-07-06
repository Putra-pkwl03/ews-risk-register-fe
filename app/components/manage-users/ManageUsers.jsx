"use client";

import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../lib/userApi";
import UserFormModal from "./UserFormModal";
import ConfirmDeleteModal from "../../components/modalconfirmasi/DeleteModal";
import SuccessToast from "../../components/modalconfirmasi/SuccessToast";
import ErrorToast from "../../components/modalconfirmasi/ErrorToast";
import Pagination from "./Pagenations";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIdx, endIdx);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const fetchUsers = () => {
    setLoading(true);
    getUsers()
      .then((data) => setUsers(data))
      .catch((err) => {
        setErrorMessage("Gagal mengambil data user.");
        setErrorOpen(true);
        console.error("Gagal ambil users:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(selectedUserId);
      fetchUsers();
      setCurrentPage(1);
      setSuccessMessage("Berhasil menghapus user!");
      setSuccessOpen(true);
    } catch (err) {
      setErrorMessage("Gagal menghapus user.");
      setErrorOpen(true);
      console.error(err);
    } finally {
      setIsConfirmOpen(false);
      setSelectedUserId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserSaved={(isEdit, error) => {
          if (error) {
            setErrorMessage(error);
            setErrorOpen(true);
          } else {
            fetchUsers();
            setSuccessMessage(
              isEdit ? "Berhasil mengedit user!" : "Berhasil menambahkan user!"
            );
            setSuccessOpen(true);
          }
        }}
        editingUser={editingUser}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
      />

      <SuccessToast
        message={successMessage}
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
      />

      <ErrorToast
        message={errorMessage}
        isOpen={errorOpen}
        onClose={() => setErrorOpen(false)}
      />

      <div className="bg-white rounded-sm shadow-gray-200 shadow-xl p-4 mb-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h5 className="text-[20px] text-black font-semibold">Manage Users</h5>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center border-[1px] border-[#9197B3] rounded-md px-2 py-2 bg-white">
              <img
                src="/icons/search.svg"
                alt="Search Icon"
                className="h-4 w-4 mr-2 opacity-60"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="outline-none text-[12px] text-[#B5B7C0] not-[]:w-full"
              />
            </div>
            <div className="relative inline-flex items-center gap-1 text-sm text-gray-400 ">
              <span>Filter By:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-gray-300 bg-white rounded-md px-2 py-1 text-[12px] text-center text-black hover:cursor-pointer appearance-none focus:outline-none pr-6 pl-0"
              >
                <option className="text-black text-center" value="">
                  All Roles
                </option>
                <option className="text-black text-center" value="admin">
                  Admin
                </option>
                <option
                  className="text-black text-center"
                  value="koordinator_unit"
                >
                  Kordinator Unit
                </option>
                <option
                  className="text-black text-center"
                  value="koordinator_mutu"
                >
                  Kordinator Mutu
                </option>
                <option
                  className="text-black text-center"
                  value="koordinator_menris"
                >
                  Koordinator Menris
                </option>
                <option
                  className="text-black text-center"
                  value="kepala_puskesmas"
                >
                  Kepala Puskesmas
                </option>
                <option
                  className="text-black text-center"
                  value="dinas_kesehatan"
                >
                  Dinkes
                </option>
              </select>
              <img
                src="/icons/chevron-down.svg"
                alt="Filter Icon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-5 pointer-events-none text-[#3D3C42]"
              />
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-1 text-sm border border-green-500 text-green-500 hover:bg-green-100 px-3 py-1.5 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Add User
            </button>
          </div>
        </div>
        <table className="w-full text-sm sm:text-base">
          <thead className="bg-gray-100 text-[#5932EA] text-left border-b-[1px] border-gray-200">
            <tr>
              <th className="p-2 text-[14px] sm:p-3 sm:text-base">No</th>
              <th className="p-2 text-[14px] sm:p-3 sm:text-base">Name</th>
              <th className="p-2 text-[14px] sm:p-3 sm:text-base">Email</th>
              <th className="p-2 text-[14px] sm:p-3 sm:text-base">Role</th>
              <th className="p-2 text-[14px] sm:p-3 sm:text-base">
                Created At
              </th>
              <th className="p-2 text-[14px] sm:p-3 sm:text-base text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(6)].map((_, index) => (
                  <tr key={index}>
                    {[...Array(6)].map((_, i) => (
                      <td key={i} className="p-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              : paginatedUsers.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`text-[12px] text-[#292D32] transition-colors border-b-[1px] border-gray-200 ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                    } hover:bg-gray-200`}
                  >
                    <td className="p-2 text-[12px] sm:p-3">
                      {startIdx + idx + 1}
                    </td>
                    <td className="p-2 text-[12px] sm:p-3">{user.name}</td>
                    <td className="p-2 text-[12px] sm:p-3">{user.email}</td>
                    <td className="p-2 text-[12px] sm:p-3 capitalize">
                      {user.role.replace("_", " ")}
                    </td>
                    <td className="p-2 text-[12px] sm:p-3">
                      {new Date(user.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-2 text-sm sm:p-3 flex gap-2 justify-center">
                      <button onClick={() => handleEdit(user)} title="Edit">
                        <img
                          src="/icons/edit.svg"
                          alt="Edit Icon"
                          className="h-5 w-5 hover:opacity-80 hover:cursor-pointer"
                        />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user.id)}
                        title="Delete"
                      >
                        <img
                          src="/icons/hapus.svg"
                          alt="Delete Icon"
                          className="h-5 w-5 hover:opacity-80 hover:cursor-pointer"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        <div className="text-sm text-gray-600 ml-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredUsers.length}
          />
        </div>
      </div>
    </div>
  );
}
