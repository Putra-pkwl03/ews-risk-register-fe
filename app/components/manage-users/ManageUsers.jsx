"use client";

import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../lib/userApi";
import UserFormModal from "./UserFormModal";
import ConfirmDeleteModal from "../../components/modalconfirmasi/DeleteModal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import SuccessToast from "../../components/modalconfirmasi/SuccessToast";
import ErrorToast from "../../components/modalconfirmasi/ErrorToast";

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

  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(selectedUserId);
      fetchUsers();
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

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Manage Users</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleAdd}
        >
          Add User
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <table className="w-full bg-white rounded shadow-md overflow-hidden text-sm sm:text-base">
          <thead className="bg-gray-300 text-gray-600 text-left border-b">
            <tr>
              <th className="p-2 text-sm sm:p-3 sm:text-base">No</th>
              <th className="p-2 text-sm sm:p-3 sm:text-base">Name</th>
              <th className="p-2 text-sm sm:p-3 sm:text-base">Email</th>
              <th className="p-2 text-sm sm:p-3 sm:text-base">Role</th>
              <th className="p-2 text-sm sm:p-3 sm:text-base">Created At</th>
              <th className="p-2 text-sm sm:p-3 sm:text-base">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr
                key={user.id}
                className="bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <td className="p-2 text-sm sm:p-3 sm:text-base">{idx + 1}</td>
                <td className="p-2 text-sm sm:p-3 sm:text-base">{user.name}</td>
                <td className="p-2 text-sm sm:p-3 sm:text-base">
                  {user.email}
                </td>
                <td className="p-2 text-sm sm:p-3 sm:text-base capitalize">
                  {user.role.replace("_", " ")}
                </td>
                <td className="p-2 text-sm sm:p-3 sm:text-base">
                  {new Date(user.created_at).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="p-2 text-sm sm:p-3 sm:text-base flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(user.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
