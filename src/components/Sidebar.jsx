import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const navigation = [
    { name: 'Configurator', path: '/configurator' },
    { name: 'Bundle Settings', path: '/bundle' },
    { name: 'Users', path: '/users' },
    { name: 'View Offers', path: '/viewoffers' },
    { name: 'Home', path: '/' }
  ];

  return (
    <div className="left-0 top-0 h-screen w-64 bg-gray-800 text-white p-4 z-50">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      
      <nav className="space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-2 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-700'
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar; 