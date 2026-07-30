// src/views/UserManagement.jsx

import React from 'react';
import { useUserViewModel } from '../viewmodels/useUserViewModel.js';

export default function UserManagement() {
  // Bind UI directly to the ViewModel exposed state and actions
  const vm = useUserViewModel();

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '1.5rem', fontFamily: 'system-ui, sans-serif', color: '#333' }}>
      <h1 style={{ borderBottom: '2px solid #eee', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>User Directory</h1>

      {/* Global Error Banner */}
      {vm.error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid #fca5a5' }}>
          ⚠️ <strong>Error:</strong> {vm.error}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={vm.submitForm} style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '2.5rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1.25rem' }}>
          {vm.editingUuid ? '⚡ Update Profile' : '👤 Register New User'}
        </h3>
        
        {/* Username Field */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: '500', fontSize: '0.9rem' }}>Username</label>
          <input
            type="text"
            name="username"
            value={vm.formData.username}
            onChange={vm.handleInputChange}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
            placeholder="e.g. johndoe"
            required
          />
        </div>

        {/* Email Field */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: '500', fontSize: '0.9rem' }}>Email Address</label>
          <input
            type="email"
            name="email"
            value={vm.formData.email}
            onChange={vm.handleInputChange}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
            placeholder="e.g. john@example.com"
            required
          />
        </div>

        {/* Password Field */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: '500', fontSize: '0.9rem' }}>
            Password {vm.editingUuid && <span style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 'normal' }}>(Leave blank to keep unchanged)</span>}
          </label>
          <input
            type="password"
            name="password"
            value={vm.formData.password}
            onChange={vm.handleInputChange}
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '1rem' }}
            placeholder={vm.editingUuid ? "••••••••" : "Enter a secure password"}
            required={!vm.editingUuid}
          />
        </div>

        {/* Form Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit" 
            disabled={vm.loading} 
            style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500' }}
          >
            {vm.loading ? 'Processing...' : vm.editingUuid ? 'Save Changes' : 'Create Account'}
          </button>
          
          {vm.editingUuid && (
            <button 
              type="button" 
              onClick={vm.clearForm} 
              style={{ padding: '10px 20px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.95rem' }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* User Records Table/List */}
      <h3 style={{ marginBottom: '1rem' }}>Registered Profiles</h3>
      
      {vm.loading && <p style={{ color: '#4b5563', fontStyle: 'italic' }}>Syncing data with Neon DB...</p>}
      {!vm.loading && vm.users.length === 0 && <p style={{ color: '#6b7280' }}>No database records found.</p>}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {vm.users.map((user) => (
          <li 
            key={user.uuid} 
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', padding: '1rem 0' }}
          >
            <div>
              <strong style={{ fontSize: '1.1rem', color: '#111827' }}>{user.username}</strong>
              <div style={{ color: '#4b5563', fontSize: '0.9rem', marginTop: '0.2rem' }}>{user.email}</div>
              <small style={{ color: '#9ca3af', display: 'block', marginTop: '0.2rem', fontFamily: 'monospace' }}>UUID: {user.uuid}</small>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => vm.selectUserForEdit(user)} 
                style={{ padding: '6px 12px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Edit
              </button>
              <button 
                onClick={() => vm.deleteUser(user.uuid)} 
                style={{ padding: '6px 12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
