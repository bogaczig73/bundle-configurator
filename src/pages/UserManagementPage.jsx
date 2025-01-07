import { useState, useEffect } from 'react';
import { createUser, getUsers, deleteUser } from '../api/users';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: 'customer',
    firstName: '',
    lastName: '',
    companyName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userBundles, setUserBundles] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersData = await getUsers();
      setUsers(usersData);

      const bundlesInfo = {};
      for (const user of usersData) {
        if (user.bundleIds && user.bundleIds.length > 0) {
          bundlesInfo[user.id] = user.bundleIds;
        }
      }
      setUserBundles(bundlesInfo);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await createUser(formData);
      setSuccess('User created successfully');
      setFormData({ 
        email: '', 
        username: '', 
        password: '', 
        role: 'customer',
        firstName: '',
        lastName: '',
        companyName: ''
      });
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.message || 'Failed to create user');
    }
  };

  const getUsersByRole = () => {
    const grouped = {
      admin: users.filter(user => user.role === 'admin'),
      account: users.filter(user => user.role === 'account'),
      customer: users.filter(user => user.role === 'customer')
    };
    return grouped;
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Opravdu chcete smazat tohoto uživatele?')) {
      return;
    }
    
    setError('');
    try {
      await deleteUser(userId);
      setSuccess('Uživatel byl úspěšně smazán');
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message || 'Failed to delete user');
    }
  };

  const handleResetPassword = async (email) => {
    if (!window.confirm('Opravdu chcete odeslat email pro reset hesla tomuto uživateli?')) {
      return;
    }
    
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Email pro reset hesla byl odeslán');
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err.message || 'Failed to send password reset email');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Správa uživatelů</h1>
        
        {/* Create User Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Vytvořit nového uživatele</h2>
          
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Křestní jméno</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="mt-1 block w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Příjmení</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="mt-1 block w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Název společnosti</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="mt-1 block w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Uživatelské jméno</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="mt-1 block w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Heslo</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                required
              >
                <option value="customer">Zákazník</option>
                <option value="admin">Admin</option>
                <option value="account">Account Manager</option>
              </select>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
        
        {/* Updated User List as Tables */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Seznam uživatelů</h2>
          
          {/* Admin Users Table */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Administrátoři ({getUsersByRole().admin.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uživatel</th>
                    <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akce</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getUsersByRole().admin.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="w-1/4 px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{user.username}</div>
                      </td>
                      <td className="w-1/3 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="w-1/6 px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-sm rounded-full bg-red-100 text-red-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="w-1/4 px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleResetPassword(user.email)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Reset hesla
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Smazat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Account Managers Table */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Account Managers ({getUsersByRole().account.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uživatel</th>
                    <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akce</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getUsersByRole().account.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="w-1/4 px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{user.username}</div>
                      </td>
                      <td className="w-1/3 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="w-1/6 px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="w-1/4 px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleResetPassword(user.email)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Reset hesla
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Smazat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customers Table */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Zákazníci ({getUsersByRole().customer.length})
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uživatel</th>
                    <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Společnost</th>
                    <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akce</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getUsersByRole().customer.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="w-1/5 px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{user.username}</div>
                      </td>
                      <td className="w-1/4 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="w-1/4 px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.companyName}
                      </td>
                      <td className="w-1/6 px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="w-1/4 px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleResetPassword(user.email)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Reset hesla
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Smazat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagementPage; 