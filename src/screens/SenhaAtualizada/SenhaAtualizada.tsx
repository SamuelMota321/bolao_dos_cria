import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check } from "lucide-react";

export const SenhaAtualizada = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#111611] overflow-hidden">
      {/* Left side - Success message */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <Button
            variant="ghost"
            className="text-white mb-8 pl-0 hover:bg-transparent self-start"
            onClick={() => navigate("/redefinir-senha")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
          </Button>

          <h1 className="text-white text-3xl font-bold mb-8 [font-family:'Plus_Jakarta_Sans',Helvetica]">
            Senha atualizada com sucesso!
          </h1>

          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-[#19e519] rounded-2xl flex items-center justify-center">
              <Check className="w-10 h-10 text-[#111611]" strokeWidth={3} />
            </div>
          </div>

          <Button 
            className="w-full h-12 bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611] rounded-xl font-bold text-base [font-family:'Plus_Jakarta_Sans',Helvetica]"
            onClick={() => navigate("/")}
          >
            Fazer login
          </Button>

          <div className="flex justify-center mt-12">
            <img
              className="w-32 h-32"
              alt="Logo"
              src="/chatgpt-image-6-de-mai--de-2025--16-00-29-1-1.png"
            />
          </div>
        </div>
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