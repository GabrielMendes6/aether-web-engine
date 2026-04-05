import React, { useState, useContext } from 'react';
import { Mail, Lock, ArrowRight, Loader2, LogIn } from 'lucide-react';
import { AuthContext } from '../../Context/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState(null);
  const [loadingLocal, setLoadingLocal] = useState(false);

  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors(null);
    setLoadingLocal(true);

    try {
      await signIn(email, password);
      console.warn('Login realizado com sucesso!');
      navigate('/'); 
    } catch (err) {
      console.error("ERRO LOGIN:", err.response || err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert('Credenciais inválidas ou erro de conexão.');
      }
    } finally {
      setLoadingLocal(false);
    }
  }

  return (
    <div className="min-h-screen flex w-full bg-white font-sans overflow-x-hidden">
      
      {/* ------------------------------------------------------------ */}
      {/* Lado Esquerdo: Identidade Visual (Azul Marinho)           */}
      {/* ------------------------------------------------------------ */}
      <div className="lg:flex lg:w-5/12 bg-[#0f172a] flex-col justify-between p-16 text-white relative overflow-hidden shadow-2xl">
        
        <div className="z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">H</div>
          <span className="text-xl font-bold tracking-tight">Heri <span className="text-blue-400 font-light">Amostra</span></span>
        </div>

        <div className="z-10">
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tighter">
            Bem-vindo de <br /> volta à sua <br /> <span className="text-blue-500 italic">plataforma.</span>
          </h1>
          <p className="text-slate-400 mt-8 text-lg font-light leading-relaxed max-w-sm">
            Acesse sua conta para gerenciar pedidos, analisar métricas e configurar suas boxes de presente.
          </p>
        </div>

        <div className="z-10 flex items-center gap-4 text-xs text-slate-500 tracking-[0.2em] uppercase font-bold">
          <span className="w-8 h-[1px] bg-slate-800"></span>
          Área Administrativa
        </div>

        {/* Efeitos de Fundo */}
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Lado Direito: Formulário de Login (Branco)                 */}
      {/* ------------------------------------------------------------ */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 sm:p-16 bg-white">
        <div className="w-full max-w-md">

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Login</h2>
            <p className="text-slate-500 mt-3 font-light text-lg">Insira suas credenciais para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="E-mail"
              icon={Mail}
              type="email"
              name="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors?.email}
            />

            <div className="space-y-1">
              <Input
                label="Senha"
                icon={Lock}
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end">
                <a href="#" className="text-[11px] text-blue-600 hover:underline font-bold uppercase tracking-wider">Esqueceu a senha?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingLocal}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-5 rounded-2xl flex justify-center items-center gap-3 transition-all shadow-xl shadow-blue-200 mt-4 group text-xs uppercase tracking-widest"
            >
              {loadingLocal ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Entrar no Sistema <LogIn className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center border-t border-slate-100 pt-8">
            <p className="text-slate-500 text-sm">
              Ainda não tem uma conta? <Link to="/auth/register" className="text-blue-600 hover:text-blue-700 font-bold underline decoration-2 underline-offset-4 decoration-blue-100">Criar conta Heri</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}