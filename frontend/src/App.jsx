import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = 'https://onrender.com';

function App() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, { username, email });
        alert("User updated successfully!");
        setEditingId(null);
      } else {
        if (!password) return alert("Password is required for new users!");
        await axios.post(API_URL, { username, email, password });
        alert("User created successfully!");
      }
      setUsername("");
      setEmail("");
      setPassword("");
      fetchUsers();
    } catch (err) {
      alert(`Operation failed: ${err.response?.data?.error || err.message}`);
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setUsername(user.username);
    setEmail(user.email);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this user permanently?")
    ) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert("User deleted!");
        fetchUsers();
      } catch (err) {
        console.error("Error deleting user:", err.message);
      }
    }
  };

  return (
    <div
      style={{
        padding: "1.5rem",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        maxWidth: "1000px",
        margin: "0 auto",
        color: "#333",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {/* Dynamic Injecting Global Media Query CSS for Responsive Elements */}
      <style>{`
        .app-title { font-size: 1.8rem; text-align: center; margin-bottom: 2rem; color: #111; }
        .grid-container { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        .form-card { background: white; padding: 1.5rem; borderRadius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); height: fit-content; }
        .input-field { padding: 12px; border: 1px solid #ced4da; borderRadius: 6px; font-size: 1rem; width: 100%; box-sizing: border-box; transition: border-color 0.2s; }
        .input-field:focus { outline: none; border-color: #4a90e2; }
        .user-list-wrapper { background: white; padding: 1.5rem; borderRadius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .responsive-cards { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .user-card { border: 1px solid #e9ecef; padding: 1rem; borderRadius: 8px; background: #fff; display: flex; flex-direction: column; gap: 0.5rem; position: relative; }
        .user-meta { font-size: 0.9rem; color: #666; }
        .user-uuid { font-size: 0.75rem; font-family: monospace; color: #999; word-break: break-all; background: #f1f3f5; padding: 4px; borderRadius: 4px; }
        .btn-group { display: flex; gap: 8px; margin-top: 0.5rem; }
        .btn { padding: 10px 16px; border: none; borderRadius: 6px; font-weight: 600; cursor: pointer; font-size: 0.95rem; width: 100%; transition: opacity 0.2s; }
        .btn:hover { opacity: 0.9; }
        .btn-primary { background: #4a90e2; color: white; }
        .btn-secondary { background: #6c757d; color: white; }
        .btn-edit { background: #ffc107; color: #212529; width: auto; padding: 6px 12px; font-size: 0.85rem; }
        .btn-delete { background: #dc3545; color: white; width: auto; padding: 6px 12px; font-size: 0.85rem; }
        
        /* Desktop View Refinements */
        @media (min-width: 768px) {
          .app-title { font-size: 2.3rem; text-align: left; }
          .grid-container { grid-template-columns: 1fr 1.5fr; align-items: start; }
          .responsive-cards { grid-template-columns: 1fr; }
          .user-card { flex-direction: row; justify-content: space-between; align-items: center; }
          .btn-group { margin-top: 0; }
        }
      `}</style>

      <h1 className="app-title">⚡ Neon Postgres User Matrix</h1>

      <div className="grid-container">
        {/* Responsive Form Layout Component */}
        <div className="form-card">
          <h3 style={{ marginTop: 0, marginBottom: "1.5rem" }}>
            {editingId
              ? "✏️ Edit Profile Parameters"
              : "➕ Register Global User"}
          </h3>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <input
              className="input-field"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="input-field"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {!editingId && (
              <input
                className="input-field"
                type="password"
                placeholder="Secure Access Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            )}
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" className="btn btn-primary">
                {editingId ? "Save Configuration" : "Create Account"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingId(null);
                    setUsername("");
                    setEmail("");
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Responsive Flex/Grid Cards Layout Replacement for Classic Tables */}
        <div className="user-list-wrapper">
          <h3 style={{ marginTop: 0, marginBottom: "1.5rem" }}>
            Active System Registries ({users.length})
          </h3>
          <div className="responsive-cards">
            {users.length === 0 ? (
              <div
                style={{ textAlign: "center", padding: "2rem", color: "#888" }}
              >
                No database entities established yet.
              </div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="user-card">
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "1.1rem" }}>
                      {user.username}
                    </div>
                    <div className="user-meta">{user.email}</div>
                    <div className="user-uuid">ID: {user.id}</div>
                  </div>
                  <div className="btn-group">
                    <button
                      onClick={() => startEdit(user)}
                      className="btn btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
