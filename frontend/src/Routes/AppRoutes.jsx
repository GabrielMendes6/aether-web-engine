import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider';

// Importação das páginas (verifique se os caminhos estão corretos)
import Login from '../Pages/Auth/Login';
import SignUp from '../Pages/Auth/SignUp';
import Dashboard from '../Pages/Dashboard';
import Home from '../Pages/Home';
import AdminLayout from '../Pages/Admin/Layout';
import EditBox from '../Pages/Admin/EditBox';
import GenericPage from '../Pages/GenericPage';

// --- COMPONENTE DE PROTEÇÃO ---
// Ele verifica se o usuário está logado. Se não, manda de volta para o Login.
const PrivateRoute = ({ children }) => {
    const { signed, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!signed) {
        return <Navigate to="/" />;
    }

    return children;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user || user.is_admin != 1) {
        return <Navigate to='/' />
    };

    return children;

}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rotas Públicas */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<SignUp />} />
                {/* Rota para a Home */}
                <Route path="/" element={<GenericPage />} />
                
                {/* Rota dinâmica para qualquer outra página: /about, /contato, /servicos */}
                <Route path="/:slug" element={<GenericPage />} />

                {/* Rota Privada: Só entra se tiver Token do Laravel */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    }
                />
                {/* Rota Administrativa */}
                <Route
                    path='/Layout'
                    element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                />
                <Route
                    path='/boxes'
                    element={
                        <AdminRoute>
                            <EditBox />
                        </AdminRoute>
                    }
                />

                {/* Rota 404 - Caso o usuário digite algo inexistente */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}