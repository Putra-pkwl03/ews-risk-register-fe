import { useEffect, useState } from 'react';
import { addUser, editUser } from '../../lib/userApi';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function UserFormModal({
  isOpen,
  onClose,
  onUserSaved,
  editingUser = null,
}) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setForm({
        name: editingUser.name || '',
        email: editingUser.email || '',
        password: '',
        confirmPassword: '',
        role: editingUser.role || '',
      });
    } else {
      setForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
      });
    }
  }, [editingUser, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editingUser && form.password !== form.confirmPassword) {
      alert('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      if (editingUser) {
        await editUser(editingUser.id, form);
      } else {
        await addUser(form);
      }
      onUserSaved(!!editingUser);
      onClose();
    } catch (err) {
      alert('Gagal menyimpan user.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="relative bg-white p-6 rounded shadow w-full max-w-md">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-0 right-0 text-red-600 hover:text-red-800"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h3 className="text-lg font-bold mb-4 text-center">
          {editingUser ? 'Perbarui Pengguna' : 'Tambah Pengguna Baru'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Nama</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required={!editingUser}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* Konfirmasi Password */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required={!editingUser}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Pilih Role --</option>
              {[
                'koordinator_unit',
                'koordinator_menris',
                'koordinator_mutu',
                'kepala_puskesmas',
                'dinas_kesehatan',
                'admin',
              ].map((role) => (
                <option key={role} value={role}>
                  {role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Simpan */}
          <div className="flex justify-center pt-4 w-full">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
