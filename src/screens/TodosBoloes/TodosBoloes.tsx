import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Header } from "../../components/ui/header";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBoloes } from "../../hooks/useBoloes";

export const TodosBoloes = (): JSX.Element => {
  const navigate = useNavigate();
  const { boloes, loading, fetchAllBoloes } = useBoloes();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllBoloes();
  }, []);

  const filteredBoloes = boloes.filter(bolao =>
    bolao.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bolao.campeonato.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (bolao.creator?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/imagem-1.png')" }}
      >
        <Header />
        <main className="px-8 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-xl [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Carregando...
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/imagem-1.png')" }}
    >
      <Header />
      <main className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-3xl font-bold [font-family:'Plus_Jakarta_Sans',Helvetica]">
            Todos os Bolões
          </h1>
          <div className="flex items-center gap-4">
            <Button
              className="bg-[#14AE5C] hover:bg-[#059749]/90 text-[#ffffff] h-10 px-6 rounded-lg font-semibold"
              onClick={() => navigate("/criar-bolao")}
            >
              Criar Bolão
            </Button>
            <Button
              variant="outline"
              className="bg-[#FFF] hover:bg-[#E6E6E6]/90 text-black border-none h-10 px-6 rounded-lg"
              onClick={() => navigate("/participar-bolao")}
            >
              Participar
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 flex justify-end">
            <div className="relative w-80">
              <Input
                className="bg-[#FFF] border-none text-black pl-10 pr-4 h-10 rounded-lg"
                placeholder="Buscar bolão..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Bolões List */}
        {filteredBoloes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBoloes.map((bolao) => (
              <div key={bolao.id} className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#111611] text-xl font-bold [font-family:'Plus_Jakarta_Sans',Helvetica]">
                    {bolao.name}
                  </h3>
                  <div className="text-[#9eb79e] text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]">
                    {bolao.participants_count} participantes
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[#9eb79e] text-sm [font-family:'Plus_Jakarta_Sans',Helvetica] mb-1">
                    Campeonato
                  </p>
                  <p className="text-[#111611] font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                    {bolao.campeonato}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-[#9eb79e] text-sm [font-family:'Plus_Jakarta_Sans',Helvetica] mb-1">
                    Criado por
                  </p>
                  <p className="text-[#111611] font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                    {bolao.creator?.name || 'Usuário'}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-[#9eb79e] text-xs [font-family:'Plus_Jakarta_Sans',Helvetica]">
                    {new Date(bolao.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  <Button
                    variant="ghost"
                    className="text-[#19e519] hover:bg-[#19e519]/10 p-2 h-auto font-medium"
                    onClick={() => navigate(`/bolao/${bolao.id}`)}
                  >
                    Visualizar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center mt-20">
            <img
              src="/chatgpt-image-6-de-mai--de-2025--16-00-29-1-1.png"
              alt="Empty State"
              className="w-32 h-32 mb-6"
            />
            <p className="text-[#9eb79e] text-xl mb-8 [font-family:'Plus_Jakarta_Sans',Helvetica]">
              {searchTerm
                ? `Nenhum bolão encontrado para "${searchTerm}"`
                : 'Nenhum bolão disponível.'
              }
            </p>
            <div className="flex items-center gap-4">
              <Button
                className="bg-[#14AE5C] hover:bg-[#059749]/90 text-[#ffffff] h-10 px-6 rounded-lg font-semibold"
                onClick={() => navigate("/criar-bolao")}
              >
                Criar um Bolão
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};