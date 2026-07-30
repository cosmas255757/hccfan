const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/users';

export const userModel = {
  // GET /api/users
  async getAll() {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error('Failed to fetch users list from server.');
    return response.json();
  },

  // GET /api/users/:id
  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) throw new Error(`Failed to find user with ID: ${id}`);
    return response.json();
  },

  // POST /api/users
  async create(userData) {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to create new user record.');
    return response.json();
  },

  // PUT /api/users/:id
  async update(id, userData) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error(`Failed to update user with ID: ${id}`);
    return response.json();
  },

  // DELETE /api/users/:id
  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Failed to delete user with ID: ${id}`);
    return response.json();
  }
};
