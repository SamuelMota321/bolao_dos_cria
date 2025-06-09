import { Button } from "../../components/ui/button";
import { Header } from "../../components/ui/header";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Dashboard = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/imagem-1.png')" }}
    >
      <Header />
      <main className="px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-3xl font-bold [font-family:'Plus_Jakarta_Sans',Helvetica]">
            Meus Bolões
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
          <Button className="bg-[#14AE5C] hover:bg-[#059749]/90 text-[#ffffff] h-10 px-6 rounded-lg font-semibold">
            Meus Bolões
          </Button>
          <Button variant="outline" className="bg-[#FFF] hover:bg-[#E6E6E6]/90 text-black border-none h-10 px-6 rounded-lg">
            Todos os Bolões
          </Button>
          <div className="flex-1 flex justify-end">
            <div className="relative w-80">
              <Input
                className="bg-[#FFF] border-none text-black pl-10 pr-4 h-10 rounded-lg"
                placeholder="Buscar bolão..."
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
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
            <Button
              className="bg-[#14AE5C] hover:bg-[#059749]/90 text-[#ffffff] h-10 px-6 rounded-lg font-semibold"
              onClick={() => navigate("/criar-bolao")}
            >
              Criar um Bolão
            </Button>
            <Button
              variant="outline"
              className="bg-[#FFF] hover:bg-[#E6E6E6]/90 text-black border-none h-10 px-6 rounded-lg"
              onClick={() => navigate("/participar-bolao")}
            >
              Ver Todos os Bolões
            </Button>
          </div>
        </div>
      </main>
    </div >
  );
};