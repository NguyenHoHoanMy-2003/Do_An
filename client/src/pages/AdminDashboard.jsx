import React, { useState, useEffect } from 'react';
import '../styles/AdminDashboard.scss';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  const user = useSelector(state => state.user?.user);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalContracts: 0,
    userStats: []
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Không tìm thấy token xác thực');
        return;
      }

      const response = await fetch('http://localhost:5001/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        return;
      }
      
      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Error loading dashboard stats');
      console.error(err);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Không tìm thấy token xác thực');
        return;
      }

      const response = await fetch('http://localhost:5001/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Error loading users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update user role
  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Không tìm thấy token xác thực');
        return;
      }

      const response = await fetch(`http://localhost:5001/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        return;
      }

      if (!response.ok) throw new Error('Failed to update role');
      
      await fetchUsers(); // Refresh user list
      setShowUserModal(false);
    } catch (err) {
      setError('Error updating user role');
      console.error(err);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Không tìm thấy token xác thực');
        return;
      }

      const response = await fetch(`http://localhost:5001/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        return;
      }

      if (!response.ok) throw new Error('Failed to delete user');
      
      await fetchUsers(); // Refresh user list
    } catch (err) {
      setError('Error deleting user');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
  }, []);

  return (
    <div className="admin-dashboard">
      <Navbar />
      <div className="admin-dashboard-content">
        <h1>Admin Dashboard</h1>
        
        {/* Stats Section */}
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Tổng số người dùng</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Tổng số bài đăng</h3>
            <p>{stats.totalProperties}</p>
          </div>
          <div className="stat-card">
            <h3>Tổng số hợp đồng</h3>
            <p>{stats.totalContracts}</p>
          </div>
        </div>

        {/* User Management Section */}
        <div className="admin-actions">
          <h2>Quản lý người dùng</h2>
          {error && <p className="error-message">{error}</p>}
          
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id_user}>
                      <td>{user.id_user}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.role}</td>
                      <td>
                        <button 
                          className="edit-btn"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                        >
                          Sửa
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteUser(user.id_user)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit User Modal */}
        {showUserModal && selectedUser && (
          <div className="modal">
            <div className="modal-content">
              <h3>Chỉnh sửa vai trò người dùng</h3>
              <p>Người dùng: {selectedUser.name}</p>
              <select 
                value={selectedUser.role}
                onChange={(e) => updateUserRole(selectedUser.id_user, e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="host">Host</option>
                <option value="renter">Renter</option>
              </select>
              <div className="modal-buttons">
                <button onClick={() => setShowUserModal(false)}>Đóng</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 