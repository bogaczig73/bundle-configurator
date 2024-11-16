import React from "react";
import Sidebar from '../components/Sidebar';

function HomePage() {
  return (
    <div className="p-8 text-center">
      <Sidebar />
      <h1 className="text-2xl font-bold mb-4">Bundle Configurator</h1>

    </div>
  );
}

export default HomePage;