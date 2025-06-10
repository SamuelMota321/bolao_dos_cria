import { useNavigate } from "react-router-dom"
import { Button } from "./button"

export const Header = () => {
  const navigate = useNavigate()

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-[#111611]">
      <div className="flex items-center gap-16">
        <div className="flex items-center gap-2">
          <img
            src="/chatgpt-image-6-de-mai--de-2025--16-00-29-1-1.png"
            alt="Logo"
            className="w-12 h-12"
          />
          <span className="text-white text-2xl font-bold [font-family:'Plus_Jakarta_Sans',Helvetica]">
            Bolão Dos Cria
          </span>
        </div>
        <div className="flex items-center gap-8">
          <span 
            className="text-white text-lg [font-family:'Plus_Jakarta_Sans',Helvetica] cursor-pointer hover:text-[#19e519] transition-colors"
            onClick={() => navigate("/dashboard")}
          >
            Inicio
          </span>
          <span className="text-white text-lg [font-family:'Plus_Jakarta_Sans',Helvetica] cursor-pointer hover:text-[#19e519] transition-colors">
            Bolões
          </span>
          <span className="text-white text-lg [font-family:'Plus_Jakarta_Sans',Helvetica] cursor-pointer hover:text-[#19e519] transition-colors">
            Partidas
          </span>
          <span 
            className="text-white text-lg [font-family:'Plus_Jakarta_Sans',Helvetica] cursor-pointer hover:text-[#19e519] transition-colors"
            onClick={() => navigate("/ranking")}
          >
            Ranking
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-white/10 rounded-lg p-2 transition-colors"
          onClick={() => navigate("/perfil-usuario")}
        >
          <div className="w-10 h-10 bg-[#9eb79e] rounded-full flex items-center justify-center">
            <span className="text-[#111611] font-bold">U</span>
          </div>
          <span className="text-white text-lg [font-family:'Plus_Jakarta_Sans',Helvetica]">
            Usuário
          </span>
        </div>
        <Button
          variant="outline"
          className="bg-[#283828] hover:bg-[#283828]/90 text-white border-none h-10 px-4"
          onClick={() => navigate("/")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 17L21 12M21 12L16 7M21 12H9M9 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>
    </nav>
  )
}