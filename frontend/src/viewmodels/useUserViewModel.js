// src/viewmodels/useUserViewModel.js

import { useState, useEffect } from 'react';
import { userModel } from '../models/userModel.js';

export function useUserViewModel() {
  // Core application states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // MVVM Form Bindings (matching your Neon DB fields)
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [editingUuid, setEditingUuid] = useState(null);

  // Auto-fetch database records when the View mounts
  useEffect(() => {
    loadUsers();
  }, []);

  // Fetch Action
  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userModel.getAll();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Two-way data binding handler for input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Create & Update Actions
  const submitForm = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.email.trim()) return;
    if (!editingUuid && !formData.password.trim()) return; 

    setLoading(true);
    setError(null);
    try {
      if (editingUuid) {
        // Exclude password from update if user left it blank
        const updatePayload = { ...formData };
        if (!updatePayload.password.trim()) {
          delete updatePayload.password;
        }
        await userModel.update(editingUuid, updatePayload);
      } else {
        await userModel.create(formData);
      }
      await loadUsers(); // Refresh data grid
      clearForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Action
  const deleteUser = async (uuid) => {
    if (!window.confirm('Are you absolutely sure you want to remove this user?')) return;
    setLoading(true);
    setError(null);
    try {
      await userModel.delete(uuid);
      await loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // UI State modifiers
  const selectUserForEdit = (user) => {
    setEditingUuid(user.uuid); // Using uuid from Neon schema
    setFormData({ username: user.username, email: user.email, password: '' }); 
  };

  const clearForm = () => {
    setEditingUuid(null);
    setFormData({ username: '', email: '', password: '' });
  };

  // Expose clean state and bindings to the View
  return {
    users,
    loading,
    error,
    formData,
    editingUuid,
    handleInputChange,
    submitForm,
    deleteUser,
    selectUserForEdit,
    clearForm,
  };
}
