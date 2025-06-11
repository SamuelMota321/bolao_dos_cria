import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { authorization } from "../../lib/utils";

interface Campeonato {
  campeonato_id: number;
  nome: string;
  slug: string;
}

export const CriarBolao = (): JSX.Element => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);

  useEffect(() => {
    fetchCampeonatos();
  }, []);

  const fetchCampeonatos = async () => {
    try {
      setError(null)
      const { data } = await api.get("/campeonatos", authorization);
      setCampeonatos(data);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  }
  return (
    <div className="min-h-screen bg-[#111611] flex">
      {/* Left side - Form */}
      <div className="w-1/2 p-8">
        <Button
          variant="ghost"
          className="text-white mb-8 pl-0 hover:bg-transparent"
          onClick={() => navigate("/dashboard")}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <h1 className="text-4xl font-bold text-white mb-12 [font-family:'Plus_Jakarta_Sans',Helvetica]">
          Criar Novo Bolão
        </h1>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-white text-base font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Nome do Bolão
            </label>
            <Input
              className="h-14 bg-[#1c261c] border-[#3d543d] rounded-xl text-base [font-family:'Plus_Jakarta_Sans',Helvetica] text-[#9eb79e]"
              placeholder="Bolão exemplo"
            />
          </div>

          <div className="space-y-2">
            <label className="text-white text-base font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Crie uma senha para o Bolão
            </label>
            <Input
              type="password"
              className="h-14 bg-[#1c261c] border-[#3d543d] rounded-xl text-base [font-family:'Plus_Jakarta_Sans',Helvetica] text-[#9eb79e]"
              placeholder="Digite no mínimo quatro caracteres"
            />
          </div>

          {error ? <div className="text-center flex flex-col items-center justify-center ">
            <p className="text-white">Não foi possivel renderizar os campeonatos disponíveis</p>
            <p className="cursor-pointer text-white font-medium text-bold underline" onClick={() => fetchCampeonatos()}>clique aqui para tentar novamente!</p>
          </div>

            :
            <div className="space-y-2">
              <label className="text-white text-base font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                Campeonato
              </label>
              <select className="w-full h-14 bg-[#1c261c] border-[#3d543d] rounded-xl text-base [font-family:'Plus_Jakarta_Sans',Helvetica] text-[#9eb79e] px-3">
                <option value="">Selecione um campeonato</option>
                {campeonatos.map(campeonato => (
                  <option value={campeonato.nome}>{campeonato.nome}</option>
                ))}
              </select>
            </div>
          }

          <div className="flex justify-center mt-12">
            <img
              className="w-32 h-32"
              alt="Logo"
              src="/chatgpt-image-6-de-mai--de-2025--16-00-29-1-1.png"
            />
          </div>

          <Button
            className="w-full h-12 bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611] rounded-[20px] font-bold text-base [font-family:'Plus_Jakarta_Sans',Helvetica] mt-8"
          >
            Criar Bolão
          </Button>
        </form>
      </div>

      {/* Right side - Image */}
      <div className="w-1/2 relative">
        <img
          className="w-full h-full object-cover"
          alt="Soccer background"
          src="/chatgpt-image-6-de-mai--de-2025--15-51-28-1-1.png"
        />
      </div>
    </div>
  );
};