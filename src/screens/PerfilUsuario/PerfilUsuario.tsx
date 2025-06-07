import React from "react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Trophy, Calendar } from "lucide-react";

export const PerfilUsuario = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B2B0B] relative overflow-hidden">
      {/* Background image with overlay */}
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
          <div className="flex items-center gap-2">
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
          Voltar
        </Button>
      </div>

      {/* Main content */}
      <div className="relative z-10 px-8 py-6">
        {/* User Profile Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#9eb79e] rounded-full flex items-center justify-center">
            <span className="text-[#111611] font-bold text-2xl">U</span>
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Usuário
            </h1>
            <p className="text-[#9eb79e] text-lg [font-family:'Plus_Jakarta_Sans',Helvetica]">
              usuario@gmail.com
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 mb-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#19e519] rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-[#111611]" />
              </div>
              <div>
                <p className="text-[#9eb79e] text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  Pontuação Total
                </p>
                <p className="text-[#111611] text-3xl font-bold [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  0
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#19e519] rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#111611]" />
              </div>
              <div>
                <p className="text-[#9eb79e] text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  Bolões Participando
                </p>
                <p className="text-[#111611] text-3xl font-bold [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  1
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              className="bg-[#283828] hover:bg-[#283828]/90 text-white border-none h-10 px-6 rounded-lg"
              onClick={() => navigate("/")}
            >
              Sair da conta
            </Button>
          </div>
        </div>

        {/* My Pools Section */}
        <div className="mb-6">
          <h2 className="text-white text-2xl font-bold mb-6 [font-family:'Plus_Jakarta_Sans',Helvetica]">
            Meus Bolões
          </h2>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-[#f8f9fa] border-b border-gray-200">
              <div className="text-[#9eb79e] text-sm font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                BOLÃO
              </div>
              <div className="text-[#9eb79e] text-sm font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                CAMPEONATO
              </div>
              <div className="text-[#9eb79e] text-sm font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                PARTICIPANTES
              </div>
              <div className="text-[#9eb79e] text-sm font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                AÇÕES
              </div>
            </div>
            
            {/* Table Row */}
            <div className="grid grid-cols-4 gap-4 p-4 items-center">
              <div className="text-[#111611] font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                Bolão exemplo
              </div>
              <div className="text-[#111611] [font-family:'Plus_Jakarta_Sans',Helvetica]">
                Brasileirão Série A
              </div>
              <div className="text-[#111611] [font-family:'Plus_Jakarta_Sans',Helvetica]">
                1 pessoas
              </div>
              <div>
                <Button
                  variant="ghost"
                  className="text-[#19e519] hover:bg-[#19e519]/10 p-0 h-auto font-medium"
                >
                  Visualizar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};