import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export const EsqueciSenha = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/verificar-codigo");
  };

  return (
    <div className="flex h-screen bg-[#111611] overflow-hidden">
      {/* Left side - Form */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            className="text-white mb-8 pl-0 hover:bg-transparent"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
          </Button>

          <h1 className="text-white text-3xl font-bold mb-4 [font-family:'Plus_Jakarta_Sans',Helvetica]">
            Redefinição de Senha
          </h1>
          <p className="text-white text-base mb-8 [font-family:'Plus_Jakarta_Sans',Helvetica]">
            Informe o e-mail cadastrado para receber o código de recuperação.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-white text-base font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-[#1c261c] border-[#3d543d] rounded-xl text-base [font-family:'Plus_Jakarta_Sans',Helvetica] text-[#9eb79e]"
                placeholder="Digite seu email"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611] rounded-xl font-bold text-base [font-family:'Plus_Jakarta_Sans',Helvetica]"
            >
              Enviar Código
            </Button>
          </form>

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