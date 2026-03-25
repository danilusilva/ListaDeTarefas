import ProtectedRoute from './components/ProtectedRoute';
import TasksPage from './pages/TaskPage'; 

export default function App() {
  return (
    <ProtectedRoute>
      <TasksPage />
    </ProtectedRoute>
  );
}