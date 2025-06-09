import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";

export const TelaCadastro = (): JSX.Element => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/sucesso");
  };

  return (
    <div className="flex h-screen bg-[#111611] overflow-hidden">
      <div className="w-1/2 flex items-center justify-center">
        <Card className="bg-transparent border-none w-[480px]">
          <CardContent className="pt-6 px-0">
            <h1 className="text-center text-[22px] font-bold text-white mb-8 [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Faça seu cadastro
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-white text-base font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  Usuário
                </label>
                <Input
                  className="h-14 bg-[#1c261c] border-[#3d543d] rounded-xl text-base [font-family:'Plus_Jakarta_Sans',Helvetica] text-[#9eb79e]"
                  placeholder="Nome de Usuário"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-white text-base font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  Email
                </label>
                <Input
                  type="email"
                  className="h-14 bg-[#1c261c] border-[#3d543d] rounded-xl text-base [font-family:'Plus_Jakarta_Sans',Helvetica] text-[#9eb79e]"
                  placeholder="Digite seu melhor e-mail"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-white text-base font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  Senha
                </label>
                <Input
                  type="password"
                  className="h-14 bg-[#1c261c] border-[#3d543d] rounded-xl text-base [font-family:'Plus_Jakarta_Sans',Helvetica] text-[#9eb79e]"
                  placeholder="Digite sua senha"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611] rounded-[20px] font-bold text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]"
              >
                Cadastrar
              </Button>

              <p className="text-center text-sm text-[#9eb79e] [font-family:'Plus_Jakarta_Sans',Helvetica]">
                Já tem uma conta?{" "}
                <span
                  className="text-white cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  Faça login
                </span>
              </p>
            </form>

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