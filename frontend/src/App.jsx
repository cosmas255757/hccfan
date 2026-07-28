import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = 'https://onrender.com';

function App() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState(null);
  
  // Custom State Managers for Premium UX
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [deleteModal, setDeleteModal] = useState({ show: false, userId: null, username: "" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (err) {
      triggerToast(`Fetch failed: ${err.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, { username, email });
        triggerToast("Profile metrics updated flawlessly!");
        setEditingId(null);
      } else {
        if (!password) {
          triggerToast("Password parameters are required!", "error");
          setIsLoading(false);
          return;
        }
        await axios.post(API_URL, { username, email, password });
        triggerToast("New entity registered securely!");
      }
      setUsername("");
      setEmail("");
      setPassword("");
      fetchUsers();
    } catch (err) {
      triggerToast(err.response?.data?.error || err.message, "error");
      setIsLoading(false);
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setUsername(user.username);
    setEmail(user.email);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = (user) => {
    setDeleteModal({ show: true, userId: user.id, username: user.username });
  };

  const executeDelete = async () => {
    const targetId = deleteModal.userId;
    setDeleteModal({ show: false, userId: null, username: "" });
    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/${targetId}`);
      triggerToast("User record purged from system registers.", "success");
      fetchUsers();
    } catch (err) {
      triggerToast(`Purge operation failed: ${err.message}`, "error");
      setIsLoading(false);
    }
  };

  return (
    <div className="app-viewport">
      {/* Embedded High-Fidelity Responsive Layout Styles and Micro-Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .app-viewport {
          padding: 1rem;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
          max-width: 1100px;
          margin: 0 auto;
          color: #1f2937;
          min-height: 100vh;
          box-sizing: border-box;
        }

        .header-section {
          text-align: center;
          margin-bottom: 2.5rem;
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .app-title { font-size: 2rem; font-weight: 800; color: #111827; letter-spacing: -0.025em; margin-bottom: 0.5rem; }
        .app-subtitle { color: #6b7280; font-size: 0.95rem; margin: 0; }

        .dashboard-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }

        .interactive-card {
          background: #ffffff;
          padding: 1.75rem;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .interactive-card:hover { transform: translateY(-2px); box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); }

        .card-heading { font-size: 1.25rem; font-weight: 700; margin-top: 0; margin-bottom: 1.5rem; color: #111827; display: flex; align-items: center; gap: 0.5rem; }

        .form-layout { display: flex; flex-direction: column; gap: 1.25rem; }
        
        .input-group { position: relative; width: 100%; }
        .input-element {
          padding: 14px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 0.95rem;
          width: 100%;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s;
          background: #f9fafb;
        }
        .input-element:focus { outline: none; border-color: #3b82f6; background: #fff; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12); }

        .btn {
          padding: 14px 24px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.95rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          width: 100%;
        }
        .btn-action-primary { background: #111827; color: white; }
        .btn-action-primary:hover { background: #1f2937; transform: translateY(-1px); }
        .btn-action-secondary { background: #f3f4f6; color: #4b5563; }
        .btn-action-secondary:hover { background: #e5e7eb; }

        .registries-view { display: flex; flex-direction: column; gap: 1rem; }
        
        .user-matrix-item {
          border: 1px solid #f3f4f6;
          padding: 1.25rem;
          border-radius: 12px;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          transition: all 0.2s ease;
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .user-matrix-item:hover { border-color: #e5e7eb; background: #fafafa; }
        
        .user-display-name { font-weight: 700; font-size: 1.1rem; color: #111827; margin-bottom: 0.25rem; }
        .user-email-string { color: #4b5563; font-size: 0.9rem; margin-bottom: 0.5rem; word-break: break-all; }
        .user-identity-hash { font-size: 0.75rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; color: #9ca3af; background: #f3f4f6; padding: 6px 10px; border-radius: 6px; word-break: break-all; display: inline-block; }

        .item-action-row { display: flex; gap: 8px; width: 100%; margin-top: 0.5rem; }
        .btn-micro { padding: 8px 14px; font-size: 0.85rem; border-radius: 8px; width: 100%; }
        .btn-micro-edit { background: #eff6ff; color: #1d4ed8; }
        .btn-micro-edit:hover { background: #dbeafe; }
        .btn-micro-delete { background: #fef2f2; color: #b91c1c; }
        .btn-micro-delete:hover { background: #fee2e2; }

        /* Premium Toast Alerts */
        .toast-banner {
          position: fixed; top: 20px; right: 20px; left: 20px; z-index: 1000;
          padding: 16px 20px; border-radius: 12px; color: white; font-weight: 600;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px;
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); font-size: 0.95rem;
        }
        .toast-success { background: #10b981; border: 1px solid #059669; }
        .toast-error { background: #ef4444; border: 1px solid #dc2626; }

        /* Animated Dark Modal Layer */
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 1rem;
        }
        .modal-body {
          background: white; padding: 1.75rem; border-radius: 16px; max-width: 400px; width: 100%;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Inline CSS Spinner */
        .loader-ring {
          display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%; border-top-color: #fff; animation: spin 0.8s linear infinite;
        }

        /* Responsive Layout Breaking Points */
        @media (min-width: 768px) {
          .app-viewport { padding: 3rem 2rem; }
          .app-title { font-size: 2.5rem; }
          .dashboard-grid { grid-template-columns: 1fr 1.4fr; align-items: start; }
          .toast-banner { left: auto; max-width: 380px; }
          .user-matrix-item { flex-direction: row; justify-content: space-between; align-items: center; padding: 1.5rem; }
          .item-action-row { width: auto; margin-top: 0; }
          .btn-micro { width: auto; }
        }
      `}</style>

      {/* Live Active Toast Messages */}
      {toast.show && (
        <div className={`toast-banner toast-${toast.type}`}>
          <span>{toast.type === "success" ? "✨" : "⚠️"}</span>
          <div style={{ flexGrow: 1 }}>{toast.message}</div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal-overlay">
          <div className="modal-body">
            <h3 style={{ margin: "0 0 0.5rem 0", color: "#111827" }}>Confirm Purge</h3>
