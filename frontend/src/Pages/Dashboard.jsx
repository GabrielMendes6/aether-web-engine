import React, { useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Minha App</h1>
        <button 
          onClick={signOut}
          className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} /> Sair
        </button>
      </nav>

      <main className="p-8">
        <div className="bg-white rounded-xl shadow-md p-6 max-w-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <UserIcon size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user?.name}</h2>
              <p className="text-sm text-slate-50">{user?.email}</p>
              {user?.is_admin && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded mt-1 inline-block">
                  Administrador
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}