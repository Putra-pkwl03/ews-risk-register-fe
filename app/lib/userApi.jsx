
import api from './api';

export async function getUsers() {
  const res = await api.get('/users');
  return res.data;
}

export async function addUser(userData) {
    const res = await api.post('/users', userData);
    return res.data;
}

export async function editUser(id, userData) {
    const res = await api.put(`/users/${id}`, userData);
    return res.data;
}

export async function deleteUser(id) {
    const res = await api.delete(`/users/${id}`);
    return res.data;
}

export async function updateProfile(profileData) {
  const res = await api.put('/profile', profileData);
  return res.data;
}