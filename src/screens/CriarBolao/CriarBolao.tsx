import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export const CriarBolao = (): JSX.Element => {
  const navigate = useNavigate();

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

          <div className="space-y-2">
            <label className="text-white text-base font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Campeonato
            </label>
            <select className="w-full h-14 bg-[#1c261c] border-[#3d543d] rounded-xl text-base [font-family:'Plus_Jakarta_Sans',Helvetica] text-[#9eb79e] px-3">
              <option value="">Selecione um campeonato</option>
              <option value="brasileirao">Brasileirão</option>
              <option value="libertadores">Libertadores</option>
              <option value="champions">Champions League</option>
            </select>
          </div>

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