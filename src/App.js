import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BundleSettingsPage from "./pages/BundleSettingsPage";
import ConfiguratorPage from "./pages/ConfiguratorPage";
import UserManagementPage from "./pages/UserManagementPage";
import { BundleProvider } from "./context/BundleContext";
import ViewOffersPage from "./pages/ViewOffersPage";
import LoginPage from "./pages/LoginPage";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { TestPage } from "./pages/TestPage";
import { TestPage2 } from "./pages/TestPage2";
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BundleProvider>
      <Router>
        <Routes>
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/users" />} />
          <Route
            path="/*"
            element={
              user ? (
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/configurator" element={<ConfiguratorPage />} />
                  <Route path="/bundle" element={<BundleSettingsPage />} />
                  <Route path="/bundle/create/:userId" element={<BundleSettingsPage />} />
                  <Route path="/users" element={<UserManagementPage />} />
                  <Route path="/configurator/create/:userId" element={<ConfiguratorPage />} />
                  <Route path="/configurator/:bundleId" element={<ConfiguratorPage />} />
                  <Route path="/viewoffers" element={<ViewOffersPage />} />
                  <Route path="/test" element={<TestPage />} />
                  <Route path="/test2" element={<TestPage2 />} />
                </Routes>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Router>
    </BundleProvider>
  );
}

export default App;
