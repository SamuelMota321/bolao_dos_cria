import { useContext, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "../../schemas/loginSchema";
import { LoginFormData, UserContext } from "../../providers/UserContext";

export const TelaInicialLogin = (): JSX.Element => {
  const { userLogin, loading } = useContext(UserContext);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });
  const navigate = useNavigate();

  const submit = async (formData: LoginFormData) => {
    try {
      setError(null);
      await userLogin(formData);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen bg-[#111611] overflow-hidden">
      <div className="w-1/2 flex items-center justify-center">
        <Card className="bg-transparent border-none w-[480px]">
          <CardContent className="pt-6 px-0">
            <h1 className="text-center text-[22px] font-bold text-white mb-8 [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Entre na sua conta
            </h1>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(submit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-white text-base font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  Email
                </label>
                <Input
                  type="text"
                  className="h-14 bg-[#1c261c] border-[#3d543d] rounded-xl text-base [font-family:'Plus_Jakarta_Sans',Helvetica] text-[#9eb79e]"
                  placeholder="Digite seu email"
                  {...register('email')}
                  error={errors.email?.message}
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
                  {...register('password')}
                  error={errors.password?.message}
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-10 bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611] rounded-[20px] font-bold text-sm [font-family:'Plus_Jakarta_Sans',Helvetica] disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-10 bg-[#283828] hover:bg-[#283828]/90 text-white border-none rounded-[20px] font-bold text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]"
                onClick={() => navigate("/cadastro")}
              >
                Criar Conta
              </Button>

              <p
                className="text-center text-sm text-[#9eb79e] [font-family:'Plus_Jakarta_Sans',Helvetica] mt-4 cursor-pointer hover:text-white transition-colors"
                onClick={() => navigate("/esqueci-senha")}
              >
                Esqueci minha senha
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