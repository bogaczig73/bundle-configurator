import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import logo from '../images/ABRA_White_Primary.png';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useCurrentUser } from '../api/users';

function Sidebar({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const { user, logout } = useCurrentUser();

  const getNavigationItems = (userRole) => {
    const allNavigation = [
      { name: 'Home', path: '/', roles: ['admin', 'account', 'customer'] },
      { name: 'Configurator', path: '/configurator', roles: ['admin', 'account'] },
      { name: 'View Offers', path: '/viewoffers', roles: ['admin', 'account'] },
      { name: 'Bundle Settings', path: '/bundle', roles: ['admin'] },
      { name: 'Users', path: '/users', roles: ['admin'] },
    ];

    if (!userRole) return [];

    return allNavigation.filter(item => item.roles.includes(userRole));
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigationItems = getNavigationItems(user?.role);

  return (
    <div className="flex">
      <div 
        className={`fixed top-0 left-0 h-screen bg-gray-800 text-white p-4 transition-all duration-300 flex flex-col ${
          isOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className={`flex items-center ${!isOpen && 'justify-center'}`}>
          <img 
            src={logo} 
            alt="Logo" 
            className={`${isOpen ? 'w-32' : 'w-10'} transition-all duration-300`}
          />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
        >
          {isOpen ? '←' : '→'}
        </button>

        <div className={`mb-8 pt-12 ${!isOpen && 'hidden'}`}>
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        
        <nav className="space-y-2 flex-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded-lg transition-colors duration-200
                ${location.pathname === item.path 
                  ? 'bg-gray-700 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                ${!isOpen && 'px-2 text-center'}`}
            >
              {isOpen ? item.name : item.name.charAt(0)}
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          {user && (
            <div className={`mb-4 ${!isOpen && 'text-center'}`}>
              <p className="text-sm text-gray-400">Logged in as:</p>
              <p className="text-sm">{user.email}</p>
              <p className="text-xs text-gray-400">({user.role})</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            {isOpen ? 'Logout' : '×'}
          </button>
        </div>
      </div>

      <div 
        className={`flex-1 transition-all duration-300 ${
          isOpen ? 'ml-64' : 'ml-16'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default Sidebar; 