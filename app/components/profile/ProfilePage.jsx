"use client";
import { useState } from "react";
import useCurrentUser from "@/app/lib/useCurrentUser";
import { updateProfile } from "@/app/lib/userApi";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import SuccessToast from "../modalconfirmasi/SuccessToast";
import ErrorToast from "../modalconfirmasi/ErrorToast";

export default function ProfilePage() {
  const user = useCurrentUser();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Toast state
  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [errorToastOpen, setErrorToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // const handleEditClick = () => {
  //   setShowForm(!showForm);
  //   if (user) {
  //     setName(user.name);
  //     setEmail(user.email || "");
  //   }
  // };

  const handleEditClick = () => {
    setModalOpen(true);
    if (user) {
      setName(user.name);
      setEmail(user.email || "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      setToastMessage("Name and email cannot be empty.");
      setErrorToastOpen(true);
      return;
    }
    if (password && password !== passwordConfirmation) {
      setToastMessage("Password confirmation does not match.");
      setErrorToastOpen(true);
      return;
    }
    try {
      await updateProfile({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
  setToastMessage("Profile updated successfully!");
      setSuccessToastOpen(true);
  setModalOpen(false); // close only on success
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setToastMessage("Failed to update profile.");
      setErrorToastOpen(true);
    }
  };

  if (!user) {
    return (
      <div className="p-4 max-w-2xl mx-auto animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4 w-1/3" />
        <div className="bg-white shadow rounded-lg p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-100 rounded w-full" />
            <div className="h-3 bg-gray-100 rounded w-2/3" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl text-black mx-auto">
      <SuccessToast
        message={toastMessage}
        isOpen={successToastOpen}
        onClose={() => setSuccessToastOpen(false)}
      />
      <ErrorToast
        message={toastMessage}
        isOpen={errorToastOpen}
        onClose={() => setErrorToastOpen(false)}
      />

  <h1 className="text-2xl font-bold mb-6 text-center">User Profile</h1>

      <div className="max-w-sm mx-auto overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-blue-400 transition-shadow duration-300 p-6 space-y-4 border">
  {/* Initial Avatar */}
        <div className="flex justify-center items-center h-40 bg-gradient-to-tr from-blue-500 to-indigo-600 text-white text-5xl font-bold rounded-xl">
          {user.name?.[0]?.toUpperCase() || "U"}
        </div>

  {/* Name & Role */}
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-800 mt-2">
            {user.name || "John Doe"}
          </p>
          <p className="text-sm text-gray-500 capitalize">
            {user.role?.replace(/_/g, " ") || "-"}
          </p>
        </div>

  {/* Details */}
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            <span className="font-semibold">Email:</span> {user.email || "-"}
          </p>
          <p>
            <span className="font-semibold">Role:</span>{" "}
            {user.role?.replace(/_/g, " ") || "-"}
          </p>
          <p>
            <span className="font-semibold">Created at:</span>{" "}
            {user.created_at
              ? new Date(user.created_at).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "-"}
          </p>
        </div>

  {/* Edit Button */}
        <div className="text-center pt-2">
          <button
            onClick={handleEditClick}
            className="text-sm px-4 py-2 text-blue-600 border border-blue-500 bg-white hover:bg-blue-50 cursor-pointer rounded-lg"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Modal Edit Profil */}
      {modalOpen && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 p-6 space-y-5 relative">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
                  Edit Profile
                </h2>

            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-4 text-gray-400 hover:text-red-600 cursor-pointer text-xl font-bold"
            >
              &times;
            </button>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full border px-3 py-2 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    className="w-full border px-3 py-2 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswordConfirm ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-sm px-4 py-2 text-red-600 border border-red-400 rounded-lg hover:bg-red-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-sm px-4 py-2 text-blue-600 border border-blue-400 hover:bg-blue-50 rounded-lg cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
