import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import logo from '../images/ABRA_White_Primary.png';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useCurrentUser } from '../api/users';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome,
  faGear,
  faCog,
  faBox,
  faUsers,
  faUser,
  faFile,
  faSignOut
} from '@fortawesome/free-solid-svg-icons';

function Sidebar({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const { user, logout } = useCurrentUser();

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  };

  const getNavigationItems = (userRole) => {
    const allNavigation = [
      { name: 'Domů', path: '/', roles: ['admin', 'account', 'customer'], icon: <FontAwesomeIcon icon={faHome} /> },
      { name: 'Konfigurátor', path: '/configurator', roles: ['admin', 'account'], icon: <FontAwesomeIcon icon={faGear} /> },
      { name: 'Náhled konfigurací', path: '/viewoffers', roles: ['admin', 'account', 'customer'], icon: <FontAwesomeIcon icon={faFile} /> },
      { name: 'Nastavení balíčků', path: '/bundle', roles: ['admin'], icon: <FontAwesomeIcon icon={faBox} /> },
      { name: 'Uživatelé', path: '/users', roles: ['admin'], icon: <FontAwesomeIcon icon={faUsers} /> },
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
        className={`fixed top-0 left-0 h-screen p-4 transition-all duration-300 flex flex-col border-r ${
          isOpen ? 'w-64' : 'w-16'
        } bg-gradient-to-br from-[#e1007b] via-[#e96b46] to-[#f6b200]`}
      >
        <div className={`flex items-center ${!isOpen && 'justify-center'}`}>
          <img 
            src={logo} 
            alt="Logo" 
            className={`${isOpen ? 'w-32' : 'w-10'} transition-all duration-300`}
          />
        </div>

        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 text-white hover:bg-white/30"
        >
          {isOpen ? '←' : '→'}
        </button>

        <div className={`mb-8 pt-12 ${!isOpen && 'hidden'}`}>
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>
        
        <nav className={`space-y-2 flex-1 ${!isOpen ? 'mt-[10vh]' : ''}`}>
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 rounded-lg transition-colors duration-200
                ${location.pathname === item.path 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/80 hover:bg-white/10 hover:text-white'}
                ${!isOpen ? 'px-2 flex items-center justify-center' : ''}`}
            >
              {isOpen ? item.name : item.icon}
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          {user && (
            <div className={`mb-4 ${!isOpen && 'text-center'}`}>
              {isOpen ? (
                <>
                  <p className="text-sm text-white/60">Přihlášen jako:</p>
                  <p className="text-sm text-white">{user.email}</p>
                  <p className="text-xs text-white/60">({user.role})</p>
                </>
              ) : (
                <FontAwesomeIcon icon={faUser} className="text-white/80" />
              )}
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`w-full px-4 py-2 text-sm text-white bg-black/20 rounded-lg hover:bg-black/30 
              ${!isOpen && 'flex items-center justify-center'}`}
          >
            {isOpen ? 'Odhlásit' : <FontAwesomeIcon icon={faSignOut} />}
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