import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

export const TelaSucesso = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#111611] overflow-hidden">
      {/* Left side - Success message */}
      <div className="w-1/2 flex items-center justify-center">
        <Card className="bg-transparent border-none w-[480px]">
          <CardContent className="pt-6 px-0">
            <h1 className="text-center text-[22px] font-bold text-white mb-8 [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Usuário cadastrado com sucesso!
            </h1>

            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-[#19e519] rounded-lg flex items-center justify-center">
                <Check className="w-8 h-8 text-[#111611]" />
              </div>
            </div>

            <Button 
              className="w-full h-10 bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611] rounded-[20px] font-bold text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]"
              onClick={() => navigate("/")}
            >
              Fazer login
            </Button>

            <div className="flex justify-center mt-12">
              <img
                className="w-[334px] h-[257px] object-cover"
                alt="Logo"
                src="/chatgpt-image-6-de-mai--de-2025--16-00-29-1-1.png"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right side - Background image */}
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