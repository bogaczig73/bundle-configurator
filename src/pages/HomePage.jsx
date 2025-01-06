import React from "react";
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '../api/users';

function HomePage() {
  const { user } = useCurrentUser();

  const getNavigationCards = (userRole) => {
    const allCards = [
      { 
        name: 'Konfigurátor', 
        path: '/configurator', 
        roles: ['admin', 'account'],
        description: 'Vytvořte a spravujte konfigurace pro zákazníky',
        icon: '⚙️'
      },
      { 
        name: 'Konfigurace', 
        path: '/viewoffers', 
        roles: ['admin', 'account'],
        description: 'Prohlížejte a upravujte existující konfigurace',
        icon: '📋'
      },
      { 
        name: 'Nastavení balíčků', 
        path: '/bundle', 
        roles: ['admin'],
        description: 'Správa nastavení a parametrů balíčků',
        icon: '📦'
      },
      { 
        name: 'Uživatelé', 
        path: '/users', 
        roles: ['admin'],
        description: 'Správa uživatelů a jejich oprávnění',
        icon: '👥'
      }
    ];

    return !userRole ? [] : allCards.filter(item => item.roles.includes(userRole));
  };

  const navigationCards = getNavigationCards(user?.role);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-8 text-gray-900">Vítejte v ABRA Bundle Configurator</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationCards.map((card) => (
            <Link
              key={card.path}
              to={card.path}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
            >
              <div className="text-3xl mb-4">{card.icon}</div>
              <h2 className="text-xl font-semibold mb-2 text-gray-900">{card.name}</h2>
              <p className="text-gray-600">{card.description}</p>
            </Link>
          ))}
        </div>

        {user?.role === 'customer' && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Vaše konfigurace</h2>
            <p className="text-gray-600">
              Zde najdete přehled vašich konfigurací a jejich aktuální stav.
            </p>
            <Link
              to="/viewoffers"
              className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Zobrazit konfigurace
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;