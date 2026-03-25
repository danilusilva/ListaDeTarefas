import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <LoginPage />;
}