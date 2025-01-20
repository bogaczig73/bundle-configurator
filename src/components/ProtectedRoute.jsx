import { Navigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '../api/users';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useCurrentUser();
  const location = useLocation();

  // Prevent infinite loops by checking if we're already trying to access login
  const isAttemptingLogin = location.pathname === '/login';

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user && !isAttemptingLogin) {
    // Pass the current location in state so we can redirect back after login
    return <Navigate 
      to="/login" 
      state={{ from: location.pathname }}
      replace 
    />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate 
      to="/unauthorized" 
      state={{ from: location.pathname }}
      replace 
    />;
  }

  return children;
}

export default ProtectedRoute; 