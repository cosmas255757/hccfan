import { query } from '../config/db.js';

const User = {
  // 1. Fetch all users from database
  getAll: async () => {
    const res = await query('SELECT id, username, email, created_at FROM users ORDER BY created_at DESC');
    return res.rows;
  },

  // 2. Fetch a specific user by their UUID string
  getById: async (id) => {
    const res = await query('SELECT id, username, email, created_at FROM users WHERE id = $1', [id]);
    return res.rows[0]; 
  },

  // 3. Insert a new record into the database with provided properties
  create: async (username, email, passwordHash) => {
    const res = await query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, passwordHash]
    );
    return res.rows[0];
  },

  // 4. Update existing profile properties matching an explicit UUID
  update: async (id, username, email) => {
    const res = await query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email, created_at',
      [username, email, id]
    );
    return res.rows[0];
  },

  // 5. Hard delete a record matching an explicit UUID
  delete: async (id) => {
    const res = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return res.rows[0];
  }
};

export default User;
