import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import Quiz from './pages/Quiz';
import QuizCompleted from './pages/QuizCompleted';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminQuestions from './pages/AdminQuestions';
import AdminResults from './pages/AdminResults';
import AdminLayout from './components/AdminLayout';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aeef]"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/quiz" replace />;

  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aeef]"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/quiz'} replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
      <Route path="/quiz-completed" element={<ProtectedRoute><QuizCompleted /></ProtectedRoute>} />
      
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="results" element={<AdminResults />} />
      </Route>

      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}

export default App;
