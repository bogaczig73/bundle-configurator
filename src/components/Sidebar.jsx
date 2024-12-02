import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logo from '../images/ABRA_White_Primary.png';

function Sidebar({ children }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const navigation = [
    { name: 'Configurator', path: '/configurator' },
    { name: 'Bundle Settings', path: '/bundle' },
    { name: 'Users', path: '/users' },
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    { name: 'View Offers', path: '/viewoffers' },
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    { name: 'Home', path: '/' }
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-screen bg-gray-800 text-white p-4 transition-all duration-300 ${
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
        
        <nav className="space-y-2">
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
      </div>

      {/* Main content */}
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