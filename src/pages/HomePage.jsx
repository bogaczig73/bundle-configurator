import React from "react";
import Sidebar from '../components/Sidebar';

function HomePage() {



  return (
    <div className="p-8">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <h1>Home</h1>
        <div className="flex flex-col items-center justify-center h-screen">
          Content will be here
        </div>
      </div>
    </div>
  );
}

export default HomePage;