import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BundleSettingsPage from "./pages/BundleSettingsPage";
import ConfiguratorPage from "./pages/ConfiguratorPage";
import UserManagementPage from "./pages/UserManagementPage";
import { BundleProvider } from "./context/BundleContext";
import ViewOffersPage from "./pages/ViewOffersPage";
function App() {
  return (
    <BundleProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/configurator" element={<ConfiguratorPage />} />
        <Route path="/bundle" element={<BundleSettingsPage />} />
        <Route path="/bundle/create/:userId" element={<BundleSettingsPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/configurator/create/:userId" element={<ConfiguratorPage />} />
        <Route path="/configurator/:bundleId" element={<ConfiguratorPage />} />
        <Route path="/viewoffers" element={<ViewOffersPage />} />
      </Routes>
    </Router>
  </BundleProvider>
  );
}
export default App;
