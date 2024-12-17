import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import logo from '../images/ABRA_White_Primary.png';
import { logout } from '../api/auth';
import { auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Sidebar({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {

        try {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData?.username) {
              setUsername(userData.username);
            } else {
              console.warn('Username field is missing in user document');
              setUsername('User'); // Fallback value
            }
          } else {
            console.warn('User document does not exist');
            setUsername('User'); // Fallback value
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUsername('User'); // Fallback value
        }
      }
    };

    fetchUserData();
  }, []);

  const navigation = [
    { name: 'Configurator', path: '/configurator' },
    { name: 'Bundle Settings', path: '/bundle' },
    { name: 'Users', path: '/users' },
    { name: 'My offers', path: '/viewoffers' },
    { name: 'Home', path: '/' }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`menu-item block px-4 py-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'menu-item-selected'
                  : ''
              } ${!isOpen && 'px-2'}`}
            >
              {isOpen ? item.name : item.name.charAt(0)}
            </Link>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-700 pt-4 mt-4">
          <div className={`flex items-center space-x-3 px-4 py-2 ${!isOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              {username.charAt(0).toUpperCase()}
            </div>
            {isOpen && (
              <span className="text-sm font-medium">{username}</span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left menu-item block px-4 py-2 rounded-lg transition-colors text-red-400 hover:text-red-300 hover:bg-gray-700 mt-2"
          >
            {isOpen ? 'Logout' : 'L'}
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