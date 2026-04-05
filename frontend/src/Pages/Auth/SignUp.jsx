import React, { useState, useContext } from 'react';
import { User, Mail, Smartphone, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { AuthContext } from '../../Context/AuthProvider'; // Ajuste o caminho se necessário
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    tel: '',
    password: '',
    password_confirmation: '',
    website_link: '',
  });
  const [errors, setErrors] = useState(null);
  const [loadingLocal, setLoadingLocal] = useState(false);

  const { signUp } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors(null);
    setLoadingLocal(true);

    try {
      console.log("Tentando cadastrar:", formData); // Log para conferir os dados antes do envio
      
      await signUp(
        formData.name,
        formData.email,
        formData.tel,
        formData.password,
        formData.password_confirmation,
        formData.website_link
      );
      
      console.warn('Cadastro realizado com sucesso!');
      navigate('/auth/login');
    } catch (err) {
      // LOG DETALHADO: Isso vai mostrar se é erro de CORS, 422 (Validação) ou 500 (Servidor)
      console.error("ERRO COMPLETO DA REQUISIÇÃO:", err.response || err);
      
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        // Se cair aqui, pode ser que o Laravel nem tenha recebido a chamada
        console.warn('Erro de conexão ou erro interno no servidor.');
      }
    } finally {
      setLoadingLocal(false);
    }
  }

  return (
    /* h-screen e w-full garantem que a tela dividida ocupe todo o espaço disponível */
    <div className="min-h-screen flex w-full bg-white font-sans overflow-x-hidden">

      {/* ------------------------------------------------------------ */}
      {/* Lado Esquerdo: Identidade Visual (Oculto em telas pequenas) */}
      {/* ------------------------------------------------------------ */}
      <div className=" lg:flex lg:w-5/12 bg-[#0f172a] flex-col justify-between p-16 text-white relative overflow-hidden shadow-2xl">

        {/* Logo/Branding Superior */}
        <div className="z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-500/20">H</div>
          <span className="text-xl font-bold tracking-tight">Heri <span className="text-blue-400 font-light">Amostra</span></span>
        </div>

        {/* Mensagem Central */}
        <div className="z-10">
          <h1 className="text-5xl font-bold leading-[1.1] tracking-tighter">
            Design <br /> inteligente para <br /> curadoria de <span className="text-blue-500 italic">presentes.</span>
          </h1>
          <p className="text-slate-400 mt-8 text-lg font-light leading-relaxed max-w-sm">
            Gerencie suas boxes, pedidos e clientes em uma interface feita para performance.
          </p>
        </div>

        {/* Rodapé da Coluna */}
        <div className="z-10 flex items-center gap-4 text-xs text-slate-500 tracking-[0.2em] uppercase font-bold">
          <span className="w-8 h-[1px] bg-slate-800"></span>
          © 2026 Sistema Heri
        </div>

        {/* Efeito Visual de Profundidade */}
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-slate-800/30 rounded-full blur-[80px]"></div>
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Lado Direito: O Formulário de Cadastro                    */}
      {/* ------------------------------------------------------------ */}
      <div className="w-full lg:w-7/12 flex items-center justify-center p-8 sm:p-16 bg-white">
        <div className="w-full max-w-md">

          {/* Título do Form */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Comece agora</h2>
            <p className="text-slate-500 mt-3 font-light text-lg">Crie sua conta em poucos segundos.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nome Completo"
              icon={User}
              type="text"
              name="name"
              required
              placeholder="Ex: Gabriel Mendes"
              value={formData.name}
              onChange={handleChange}
              error={errors?.name}
            />

            <Input
              label="E-mail Corporativo"
              icon={Mail}
              type="email"
              name="email"
              required
              placeholder="mendes@exemplo.com"
              value={formData.email}
              onChange={handleChange}
              error={errors?.email}
            />

            <Input
              label="WhatsApp / Telefone"
              icon={Smartphone}
              type="tel"
              name="tel"
              required
              placeholder="(47) 99999-9999"
              value={formData.tel}
              onChange={handleChange}
              error={errors?.tel}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Senha"
                icon={Lock}
                type="password"
                name="password"
                required
                placeholder="••••"
                value={formData.password}
                onChange={handleChange}
              />
              <Input
                label="Confirmar"
                icon={Lock}
                type="password"
                name="password_confirmation"
                required
                placeholder="••••"
                value={formData.password_confirmation}
                onChange={handleChange}
              />
            </div>
            <div className='hidden'>
              <Input 
                type='text'
              />
            </div>
            {errors?.password && (
              <span className="text-red-500 text-[10px] ml-1 mt-1 block italic">{errors.password[0]}</span>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-5 rounded-2xl flex justify-center items-center gap-3 transition-all shadow-xl shadow-blue-200 mt-8 group text-xs uppercase tracking-widest"
            >
              {loadingLocal ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Finalizar Cadastro <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Links de Suporte */}
          <div className="mt-12 text-center border-t border-slate-100 pt-8">
            <p className="text-slate-500 text-sm">
              Já faz parte da Heri? <a href="/auth/login" className="text-blue-600 hover:text-blue-700 font-bold underline decoration-2 underline-offset-4 decoration-blue-100">Acessar Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}