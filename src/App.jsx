import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BundleSettingsPage from "./pages/BundleSettingsPage";
import ConfiguratorPage from "./pages/ConfiguratorPage";
import UserManagementPage from "./pages/UserManagementPage";
import ViewOffersPage from "./pages/ViewOffersPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { ToastProvider } from './context/ToastContext';

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
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          <Route path="/*" element={
            <Routes>
              <Route path="/" element={
                <ProtectedRoute allowedRoles={['admin', 'account', 'customer']}>
                  <HomePage />
                </ProtectedRoute>
              } />

              <Route path="/configurator" element={
                <ProtectedRoute allowedRoles={['admin', 'account']}>
                  <ConfiguratorPage />
                </ProtectedRoute>
              } />
              
              <Route path="/bundle" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <BundleSettingsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagementPage />
                </ProtectedRoute>
              } />
              
              <Route path="/viewoffers/:id" element={<ViewOffersPage />} />
              
              <Route path="/viewoffers" element={
                <ProtectedRoute allowedRoles={['admin', 'account', 'customer']}>
                  <ViewOffersPage />
                </ProtectedRoute>
              } />
              
              <Route path="/configurator/create/:userId" element={
                <ProtectedRoute allowedRoles={['admin', 'account']}>
                  <ConfiguratorPage />
                </ProtectedRoute>
              } />
              
              <Route path="/configurator/:bundleId" element={
                <ProtectedRoute allowedRoles={['admin', 'account', 'customer']}>
                  <ConfiguratorPage />
                </ProtectedRoute>
              } />
            </Routes>
          } />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
