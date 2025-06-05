import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";

export const TelaInicialLogin = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-[#111611] overflow-hidden">
      {/* Left side - Login form */}
      <div className="w-1/2 flex items-center justify-center">
        <Card className="bg-transparent border-none w-[480px]">
          <CardContent className="pt-6 px-0">
            <h1 className="text-center text-[22px] font-bold text-white mb-8 [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Entre na sua conta
            </h1>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-white text-base font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  Email
                </label>
                <Input
                  className="h-14 bg-[#1c261c] border-[#3d543d] rounded-xl text-base [font-family:'Plus_Jakarta_Sans',Helvetica] text-[#9eb79e]"
                  defaultValue="jean@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white text-base font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  Senha
                </label>
                <Input
                  type="password"
                  className="h-14 bg-[#1c261c] border-[#3d543d] rounded-xl text-base [font-family:'Plus_Jakarta_Sans',Helvetica] text-[#9eb79e]"
                  defaultValue="*********"
                />
              </div>

              <Button className="w-full h-10 bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611] rounded-[20px] font-bold text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]">
                Entrar
              </Button>

              <p className="text-center text-sm text-[#9eb79e] [font-family:'Plus_Jakarta_Sans',Helvetica]">
                Não tem uma conta?
              </p>

              <Button
                variant="outline"
                className="w-full h-10 bg-[#283828] hover:bg-[#283828]/90 text-white border-none rounded-[20px] font-bold text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]"
                onClick={() => navigate("/cadastro")}
              >
                Criar Conta
              </Button>

              <p className="text-center text-sm text-[#9eb79e] [font-family:'Plus_Jakarta_Sans',Helvetica] mt-4 cursor-pointer">
                Esqueci minha senha
              </p>
            </div>

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

      {/* Google icon - positioned according to design */}
      <img
        className="absolute w-6 h-6 hidden"
        alt="Flat color icons"
        src="/flat-color-icons-google.svg"
      />
    </div>
  );
};