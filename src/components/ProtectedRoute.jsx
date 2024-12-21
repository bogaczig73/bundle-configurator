import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '../api/users';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useCurrentUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default ProtectedRoute; 