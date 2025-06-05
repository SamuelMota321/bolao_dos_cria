import React from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";

export const Dashboard = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-[#0B2B0B]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 bg-[#111611]">
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

      {/* Main Content */}
      <main className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-3xl font-bold [font-family:'Plus_Jakarta_Sans',Helvetica]">
            Meus Bolões
          </h1>
          <div className="flex items-center gap-4">
            <Button className="bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611] h-10 px-6 rounded-lg font-semibold">
              Criar Bolão
            </Button>
            <Button variant="outline" className="bg-[#283828] hover:bg-[#283828]/90 text-white border-none h-10 px-6 rounded-lg">
              Participar
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <Button className="bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611] h-10 px-6 rounded-lg font-semibold">
            Meus Bolões
          </Button>
          <Button variant="outline" className="bg-[#283828] hover:bg-[#283828]/90 text-white border-none h-10 px-6 rounded-lg">
            Todos os Bolões
          </Button>
          <div className="flex-1 flex justify-end">
            <div className="relative w-80">
              <Input 
                className="bg-[#283828] border-none text-white pl-10 pr-4 h-10 rounded-lg"
                placeholder="Buscar bolão..."
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center mt-20">
          <img
            src="/chatgpt-image-6-de-mai--de-2025--16-00-29-1-1.png"
            alt="Empty State"
            className="w-32 h-32 mb-6"
          />
          <p className="text-[#9eb79e] text-xl mb-8 [font-family:'Plus_Jakarta_Sans',Helvetica]">
            Você ainda não participa de nenhum bolão.
          </p>
          <div className="flex items-center gap-4">
            <Button className="bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611] h-10 px-6 rounded-lg font-semibold">
              Criar um Bolão
            </Button>
            <Button variant="outline" className="bg-[#283828] hover:bg-[#283828]/90 text-white border-none h-10 px-6 rounded-lg">
              Ver Todos os Bolões
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};