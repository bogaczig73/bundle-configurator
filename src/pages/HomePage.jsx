
import React, { useState, useRef, useEffect } from "react";
import Sidebar from '../components/Sidebar';
import abraLogo from '../images/ABRA_Color_Primary.jpg';
import vyplatnice from '../images/vyplatnice.png';

function HomePage() {


  return (
    <div className="p-8">
      <Sidebar />
      <h1 className="text-2xl font-bold mb-4 text-center">Bundle Configurator</h1>

    </div>
  );
}

export default HomePage;