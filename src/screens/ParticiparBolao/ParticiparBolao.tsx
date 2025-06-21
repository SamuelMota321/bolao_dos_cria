import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { Header } from "../../components/ui/header";
import { useBoloes } from "../../hooks/useBoloes";

export const ParticiparBolao = (): JSX.Element => {
  const navigate = useNavigate();
  const { joinBolaoByPassword, loading } = useBoloes();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError('Digite a senha do bolão');
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      
      const bolao = await joinBolaoByPassword(password);
      setSuccess(`Você entrou no bolão "${bolao.name}" com sucesso!`);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar no bolão');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/imagem-1.png')" }}
    >
      {/* Navigation */}
      <Header />

      {/* Back button */}
      <div className="relative z-10 px-8 pt-6">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10 pl-0"
          onClick={() => navigate("/dashboard")}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar para bolões
        </Button>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <h1 className="text-white text-4xl font-bold mb-4 [font-family:'Plus_Jakarta_Sans',Helvetica]">
            Participar de um Bolão
          </h1>
          <p className="text-white text-lg mb-8 [font-family:'Plus_Jakarta_Sans',Helvetica]">
            Digite a senha do bolão para participar
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6 w-96 mx-auto">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded-lg mb-6 w-96 mx-auto">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-96 mx-auto">
            <div className="relative mb-6">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 bg-white/90 border-none rounded-xl text-base [font-family:'Plus_Jakarta_Sans',Helvetica] text-[#111611] pr-12 text-center tracking-widest"
                placeholder="*****"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#111611] hover:text-[#111611]/70"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <p className="text-white text-sm mb-8 [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Peça a senha para o administrador do bolão
            </p>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611] rounded-xl font-bold text-base [font-family:'Plus_Jakarta_Sans',Helvetica] disabled:opacity-50"
            >
              {loading ? 'Entrando no Bolão...' : 'Participar do Bolão'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};