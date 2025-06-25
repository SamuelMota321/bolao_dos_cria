import { useState, useEffect } from "react";
import { Header } from "../../components/ui/header";
import { Input } from "../../components/ui/input";
import { Search, Trophy } from "lucide-react";
import { supabase, Profile } from "../../lib/supabase";

interface RankingUser extends Profile {
  totalPoints: number;
  position: number;
}

export const Ranking = (): JSX.Element => {
  const [searchTerm, setSearchTerm] = useState("");
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlobalRanking();
  }, []);

  const fetchGlobalRanking = async () => {
    try {
      setLoading(true);
      
      // Buscar todos os usuários com suas pontuações totais
      const { data: predictionsData, error: predictionsError } = await supabase
        .from('predictions')
        .select(`
          user_id,
          points,
          user:profiles!user_id(id, name, email, created_at, updated_at)
        `);

      if (predictionsError) throw predictionsError;

      // Agrupar pontuações por usuário
      const userPoints: { [key: string]: { user: Profile, totalPoints: number } } = {};
      
      predictionsData?.forEach(prediction => {
        if (prediction.user) {
          if (!userPoints[prediction.user_id]) {
            userPoints[prediction.user_id] = {
              user: prediction.user,
              totalPoints: 0
            };
          }
          userPoints[prediction.user_id].totalPoints += prediction.points;
        }
      });

      // Converter para array e ordenar por pontuação
      const rankingArray = Object.values(userPoints)
        .map((item, index) => ({
          ...item.user,
          totalPoints: item.totalPoints,
          position: index + 1
        }))
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((item, index) => ({
          ...item,
          position: index + 1
        }));

      setRanking(rankingArray);
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredData = ranking.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/imagem-1.png')" }}>
        <Header />
        <main className="px-8 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-xl [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Carregando ranking...
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/imagem-1.png')" }}>
      <Header />
      
      <main className="px-8 py-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-[#19e519]" />
            <h1 className="text-white text-4xl font-bold [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Ranking Global
            </h1>
          </div>
          <p className="text-white text-lg mb-6 [font-family:'Plus_Jakarta_Sans',Helvetica]">
            Pontuação geral de todos os participantes
          </p>
          
          <div className="relative max-w-2xl">
            <Input
              className="bg-white border-none text-black pl-12 pr-4 h-12 rounded-lg text-base"
              placeholder="Buscar usuário..."
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
              Pontuação Total
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-100">
            {filteredData.length > 0 ? (
              filteredData.map((user) => (
                <div key={user.id} className="grid grid-cols-3 gap-4 p-6 items-center hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    {getPositionIcon(user.position)}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#9eb79e] rounded-full flex items-center justify-center">
                      <span className="text-[#111611] font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
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
                      {user.totalPoints}
                    </span>
                    <p className="text-gray-500 text-xs [font-family:'Plus_Jakarta_Sans',Helvetica]">
                      pontos
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  {searchTerm ? `Nenhum usuário encontrado para "${searchTerm}"` : 'Nenhum usuário com pontuação ainda'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};