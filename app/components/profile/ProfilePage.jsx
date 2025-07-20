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
  

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // Toast state
  const [successToastOpen, setSuccessToastOpen] = useState(false);
  const [errorToastOpen, setErrorToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleEditClick = () => {
    setShowForm(!showForm);
    if (user) {
      setName(user.name);
      setEmail(user.email || "");
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await updateProfile({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    setToastMessage("Profil berhasil diperbarui!");
    setSuccessToastOpen(true);
    setShowForm(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (err) {
    console.error("Gagal update profil:", err);
    setToastMessage("Gagal memperbarui profil.");
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
    <div className="p-4 max-w-2xl mx-auto">
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

      <h1 className="text-2xl font-bold mb-4">Profil Pengguna</h1>
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-4 border">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-gray-500 text-sm">{user.role?.replace(/_/g, " ") || "-"}</p>
          </div>
        </div>

        <div className="text-sm space-y-2 pt-2 border-t">
          <p>
            <span className="font-semibold">Email:</span> {user.email || "-"}
          </p>
          <p>
            <span className="font-semibold">Role:</span> {user.role?.replace(/_/g, " ") || "-"}
          </p>
          <p>
            <span className="font-semibold">Dibuat pada:</span>{" "}
            {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
          </p>
        </div>

        <button
          onClick={handleEditClick}
          className="text-blue-600 hover:text-blue-800 text-sm underline font-medium"
        >
          {showForm ? "Batal" : "Edit Profil"}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="pt-4 space-y-4 text-sm">
            <div>
              <label className="block font-medium mb-1">Nama</label>
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
              <label className="block font-medium mb-1">Password Baru</label>
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

            <div className="mb-4">
              <label className="block font-medium mb-1">Konfirmasi Password Baru</label>
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

           <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-[90px] h-[42px] text-sm text-red-600 border border-red-400 rounded-lg hover:bg-red-100 hover:cursor-pointer"
            >
              Cencel
            </button>

            <button
              type="submit"
              className="text-blue-600 border-blue-500 hover:bg-blue-100 hover:cursor-pointer w-[90px] h-[42px] text-sm border rounded-lg flex items-center justify-center"
            >
              Save
            </button>
          </div>
          </form>
        )}
      </div>
    </div>
  );
}
