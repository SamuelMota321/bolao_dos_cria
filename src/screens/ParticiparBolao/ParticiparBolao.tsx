import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

export const ParticiparBolao = (): JSX.Element => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0B2B0B] relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          alt="Soccer background"
          src="/chatgpt-image-6-de-mai--de-2025--15-51-28-1-1.png"
        />
        <div className="absolute inset-0 bg-[#0B2B0B]/80"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-4 bg-[#111611]/90 backdrop-blur-sm">
        <div className="flex items-center gap-16">
          <div className="flex items-center gap-2">
            <img
              src="/chatgpt-image-6-de-mai--de-2025--16-00-29-1-1.png"
              alt="Logo"
              className="w-12 h-12"
            />
            <span className="text-white text-2xl font-bold [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Bolão Dos Cria
            </span>
          </div>
          <div className="flex items-center gap-8">
            <span className="text-white text-lg [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Inicio
            </span>
            <span className="text-white text-lg [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Bolões
            </span>
            <span className="text-white text-lg [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Partidas
            </span>
            <span className="text-white text-lg [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Ranking
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:bg-white/10 rounded-lg p-2 transition-colors"
            onClick={() => navigate("/perfil-usuario")}
          >
            <div className="w-10 h-10 bg-[#9eb79e] rounded-full flex items-center justify-center">
              <span className="text-[#111611] font-bold">U</span>
            </div>
            <span className="text-white text-lg [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Usuário
            </span>
          </div>
          <Button
            variant="outline"
            className="bg-[#283828] hover:bg-[#283828]/90 text-white border-none h-10 px-4"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 17L21 12M21 12L16 7M21 12H9M9 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </div>
      </nav>

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

          <form onSubmit={handleSubmit} className="w-96 mx-auto">
            <div className="relative mb-6">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 bg-white/90 border-none rounded-xl text-base [font-family:'Plus_Jakarta_Sans',Helvetica] text-[#111611] pr-12 text-center text-2xl tracking-widest"
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
              className="w-full h-12 bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611] rounded-xl font-bold text-base [font-family:'Plus_Jakarta_Sans',Helvetica]"
            >
              Participar do Bolão
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};