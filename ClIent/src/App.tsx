import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ApartmentsListPage } from '@/pages/ApartmentsListPage';
import { ApartmentDetailPage } from '@/pages/ApartmentDetailPage';
import { CreateApartmentPage } from '@/pages/CreateApartmentPage';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Dashboard Routes - Protected */}
          <Route element={<DashboardLayout />}>
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/apartments" 
              element={
                <ProtectedRoute>
                  <ApartmentsListPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/apartments/create" 
              element={
                <ProtectedRoute>
                  <CreateApartmentPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/apartments/:id" 
              element={
                <ProtectedRoute>
                  <ApartmentDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/apartments/:id/edit" 
              element={
                <ProtectedRoute>
                  <CreateApartmentPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Placeholder routes for other sections */}
            <Route path="/bookings" element={<ProtectedRoute><div className="p-8 text-center"><h1 className="text-2xl font-bold">Réservations</h1><p className="text-gray-500 mt-2">Page en cours de développement</p></div></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><div className="p-8 text-center"><h1 className="text-2xl font-bold">Messages</h1><p className="text-gray-500 mt-2">Page en cours de développement</p></div></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><div className="p-8 text-center"><h1 className="text-2xl font-bold">Statistiques</h1><p className="text-gray-500 mt-2">Page en cours de développement</p></div></ProtectedRoute>} />
            <Route path="/guests" element={<ProtectedRoute><div className="p-8 text-center"><h1 className="text-2xl font-bold">Clients</h1><p className="text-gray-500 mt-2">Page en cours de développement</p></div></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><div className="p-8 text-center"><h1 className="text-2xl font-bold">Notifications</h1><p className="text-gray-500 mt-2">Page en cours de développement</p></div></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><div className="p-8 text-center"><h1 className="text-2xl font-bold">Paramètres</h1><p className="text-gray-500 mt-2">Page en cours de développement</p></div></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><div className="p-8 text-center"><h1 className="text-2xl font-bold">Profil</h1><p className="text-gray-500 mt-2">Page en cours de développement</p></div></ProtectedRoute>} />
          </Route>

          {/* Redirect root based on auth status */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h1 className="text-4xl font-bold text-gray-900">404</h1><p className="text-gray-500 mt-2">Page non trouvée</p></div></div>} />
        </Routes>
      </AuthProvider>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
