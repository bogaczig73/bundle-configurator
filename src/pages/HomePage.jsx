import React, { useState, useRef, useEffect } from "react";
import Sidebar from '../components/Sidebar';
import abraLogo from '../images/ABRA_Color_Primary.jpg';
import vyplatnice from '../images/vyplatnice.png';

function HomePage() {
  const [position, setPosition] = useState({ x: Math.random() * (window.innerWidth - 200), y: Math.random() * (window.innerHeight - 200) });
  const elementRef = useRef(null);
  const lastMoveRef = useRef(Date.now());

  const moveElement = () => {
    const now = Date.now();
    if (now - lastMoveRef.current < 500) return;
    
    const maxX = window.innerWidth - 200;
    const maxY = window.innerHeight - 200;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    setPosition({ x: newX, y: newY });
    lastMoveRef.current = now;
  };

  const handleMouseNear = (e) => {
    if (!elementRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const distance = Math.sqrt(
      Math.pow(mouseX - (rect.left + rect.width/2), 2) +
      Math.pow(mouseY - (rect.top + rect.height/2), 2)
    );
    
    if (distance < 200) {
      moveElement();
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseNear);
    return () => window.removeEventListener('mousemove', handleMouseNear);
  }, []);

  return (
    <div className="p-8" onMouseMove={handleMouseNear}>
      <Sidebar />
      <h1 className="text-2xl font-bold mb-4 text-center">Bundle Configurator</h1>


    </div>
  );
}

export default HomePage;