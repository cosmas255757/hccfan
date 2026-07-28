import User from '../models/userModel.js';

// 1. Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Get a user by UUID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await User.getById(id);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Create a new user
export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Simple validation check
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields (username, email, password) are required' });
    }

    const passwordHash = password; 
    
    const rows = await User.create(username, email, passwordHash);
    res.status(201).json({ message: 'User created successfully', user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update an existing user properties by UUID
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email fields are required for modification' });
    }

    const rows = await User.update(id, username, email);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found to update' });
    }

    res.status(200).json({ message: 'User updated successfully', user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Delete a user by UUID
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await User.delete(id);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found to delete' });
    }

    res.status(200).json({ message: 'User successfully permanently dropped from database' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
