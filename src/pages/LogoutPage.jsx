import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../api/users';

function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useCurrentUser();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
      } finally {
        // Always redirect to login, even if logout fails
        navigate('/login', { replace: true });
      }
    };

    performLogout();
  }, [logout, navigate]);

  // Show nothing while logging out
  return null;
}

export default LogoutPage; 