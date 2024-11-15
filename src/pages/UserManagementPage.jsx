import { useState, useEffect } from 'react';
import { createUser, getUsers } from '../api/users';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: 'customer'
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
      setFormData({ email: '', username: '', password: '', role: 'customer' });
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

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
        
        {/* Create User Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New User</h2>
          
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}
          
          <form onSubmit={handleSubmit}>
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
              <label className="block text-sm font-medium text-gray-700">Username</label>
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
              <label className="block text-sm font-medium text-gray-700">Password</label>
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
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
                <option value="account">Account</option>
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
        
        {/* Updated User List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User List</h2>
          
          {/* Admin Users */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Administrators ({getUsersByRole().admin.length})
            </h3>
            <ul className="divide-y divide-gray-200 bg-gray-50 rounded-lg">
              {getUsersByRole().admin.map(user => (
                <li key={user.id} className="p-3 hover:bg-gray-100">
                  <span className="font-medium">{user.username}</span>
                  <span className="ml-2 text-sm text-gray-500">{user.email}</span>
                  <span className="ml-2 px-2 py-1 text-sm rounded-full bg-red-100 text-red-800">
                    {user.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Users */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Account Managers ({getUsersByRole().account.length})
            </h3>
            <ul className="divide-y divide-gray-200 bg-gray-50 rounded-lg">
              {getUsersByRole().account.map(user => (
                <li key={user.id} className="p-3 hover:bg-gray-100">
                  <span className="font-medium">{user.username}</span>
                  <span className="ml-2 text-sm text-gray-500">{user.email}</span>
                  <span className="ml-2 px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Users - Updated with View Offer button */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Customers ({getUsersByRole().customer.length})
            </h3>
            <ul className="divide-y divide-gray-200 bg-gray-50 rounded-lg">
              {getUsersByRole().customer.map(user => (
                <li key={user.id} className="p-3 hover:bg-gray-100 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium">{user.username}</span>
                    <span className="ml-2 text-sm text-gray-500">{user.email}</span>
                    <span className="ml-2 px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                      {user.role}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {userBundles[user.id] ? (
                      <>
                        <Link 
                          to={`/configurator/${userBundles[user.id][0]}`} 
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm"
                        >
                          View Offer
                        </Link>
                        <Link 
                          to={`/bundle/create/${user.id}`}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                        >
                          Create New Bundle
                        </Link>
                      </>
                    ) : (
                      <Link 
                        to={`/bundle/create/${user.id}`}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                      >
                        Create Bundle
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagementPage; 