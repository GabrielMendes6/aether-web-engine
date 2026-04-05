import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthProvider';
import { LayoutDashboard, Package, Users, Settings, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const { signOut, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/auth/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar - Azul Marinho Heri */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col fixed h-full">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">H</div>
          <span className="font-bold tracking-tight">Heri Admin</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <MenuLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <MenuLink to="/boxes" icon={Package} label="Minhas Boxes" />
          <MenuLink to="/clientes" icon={Users} label="Clientes" />
          <MenuLink to="/configuracoes" icon={Settings} label="Configurações" />
        </nav>

        <button 
          onClick={handleLogout}
          className="p-6 flex items-center gap-3 text-slate-400 hover:text-white transition-colors border-t border-slate-800"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Sair do Sistema</span>
        </button>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-slate-800">Área de Edição</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{user?.email}</span>
            <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm"></div>
          </div>
        </header>
        
        {children}
      </main>
    </div>
  );
}

function MenuLink({ to, icon: Icon, label }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-blue-600/10 hover:text-blue-400 rounded-xl transition-all group">
      <Icon size={20} className="group-hover:scale-110 transition-transform" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}