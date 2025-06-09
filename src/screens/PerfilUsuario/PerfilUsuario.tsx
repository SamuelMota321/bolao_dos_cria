import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Trophy, Calendar } from "lucide-react";
import { Header } from "../../components/ui/header";

export const PerfilUsuario = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/imagem-1.png')" }}
    >

      <Header />

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