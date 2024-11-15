import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ConfigurationPage from './pages/BundleSettingsPage';
import UserManagementPage from './pages/UserManagementPage';
import BundlesPage from './pages/ConfiguratorPage';
import BundlePage from './pages/BundlePage';
import { BundleProvider } from './context/BundleContext';

function App() {
  return (
    <Router>
      <BundleProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<ConfigurationPage />} />
            <Route path="/bundles" element={<BundleSettingsPage />} />
            <Route path="/users" element={<UserManagementPage />} />
            <Route path="/bundles/create/:userId" element={<BundleSettingsPage />} />
            <Route path="/configurator" element={<BundlesPage />} />
            <Route path="/configurator/create/:userId" element={<BundlesPage />} />
            <Route path="/configurator/:bundleId" element={<ConfiguratorPage />} />
          </Routes>
        </Layout>
      </BundleProvider>
    </Router>
  );
}

export default App; 