import { useState } from "react";
import { Header } from "../../components/ui/header";
import { Input } from "../../components/ui/input";
import { Search, Trophy, Medal, Award } from "lucide-react";

interface RankingUser {
  position: number;
  name: string;
  email: string;
  points: number;
  avatar: string;
}

const mockRankingData: RankingUser[] = [
  {
    position: 1,
    name: "Maria Oliveira",
    email: "maria@exemplo.com",
    points: 42,
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  },
  {
    position: 2,
    name: "João Silva",
    email: "joao@exemplo.com",
    points: 35,
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  },
  {
    position: 3,
    name: "Pedro Souza",
    email: "pedro@exemplo.com",
    points: 30,
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  },
  {
    position: 4,
    name: "Carlos Santos",
    email: "carlos@exemplo.com",
    points: 27,
    avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
  }
];

export const Ranking = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState("");

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return (
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">1</span>
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">2</span>
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">3</span>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-700 font-bold text-sm">{position}</span>
          </div>
        );
    }
  };

  const filteredData = mockRankingData.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/imagem-1.png')" }}
    >
      <Header />
      
      <main className="px-8 py-6">
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold mb-4 [font-family:'Plus_Jakarta_Sans',Helvetica]">
            Ranking
          </h1>
          <p className="text-white text-lg mb-6 [font-family:'Plus_Jakarta_Sans',Helvetica]">
            Escolha um bolão para ver o ranking específico
          </p>
          
          <div className="relative max-w-2xl">
            <Input
              className="bg-white border-none text-black pl-12 pr-4 h-12 rounded-lg text-base"
              placeholder="Buscar bolão..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
        </div>

        {/* Ranking Table */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg">
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-gray-50 border-b border-gray-200">
            <div className="text-gray-600 text-sm font-semibold uppercase tracking-wide [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Posição
            </div>
            <div className="text-gray-600 text-sm font-semibold uppercase tracking-wide [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Participante
            </div>
            <div className="text-gray-600 text-sm font-semibold uppercase tracking-wide [font-family:'Plus_Jakarta_Sans',Helvetica] text-right">
              Pontuação
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-100">
            {filteredData.map((user) => (
              <div key={user.position} className="grid grid-cols-3 gap-4 p-6 items-center hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  {getPositionIcon(user.position)}
                </div>
                
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[#111611] font-semibold text-base [font-family:'Plus_Jakarta_Sans',Helvetica]">
                      {user.name}
                    </p>
                    <p className="text-gray-500 text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]">
                      {user.email}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-[#111611] font-bold text-2xl [font-family:'Plus_Jakarta_Sans',Helvetica]">
                    {user.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white text-lg [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Nenhum resultado encontrado para "{searchTerm}"
            </p>
          </div>
        )}
      </main>
    </div>
  );
};