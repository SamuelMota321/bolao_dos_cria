import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Header } from "../../components/ui/header";
import { Input } from "../../components/ui/input";
import { ChevronLeft, Plus, Trash2, Edit, Users, Calendar, Trophy } from "lucide-react";
import { supabase, Bolao, BolaoParticipant, Match, Prediction } from "../../lib/supabase";
import { UserContext } from "../../providers/UserContext";

export const VisualizarBolao = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  
  const [bolao, setBolao] = useState<Bolao | null>(null);
  const [participants, setParticipants] = useState<BolaoParticipant[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'partidas' | 'classificacao'>('partidas');
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [newMatch, setNewMatch] = useState({
    team_home: '',
    team_away: '',
    match_date: '',
    match_time: ''
  });

  const isOwner = user && bolao && user.id === bolao.creator_id;

  useEffect(() => {
    if (id) {
      fetchBolaoData();
    }
  }, [id]);

  const fetchBolaoData = async () => {
    try {
      setLoading(true);
      
      // Buscar dados do bolão
      const { data: bolaoData, error: bolaoError } = await supabase
        .from('boloes')
        .select(`
          *,
          creator:profiles!creator_id(name, email)
        `)
        .eq('id', id)
        .single();

      if (bolaoError) throw bolaoError;
      setBolao(bolaoData);

      // Buscar participantes
      const { data: participantsData, error: participantsError } = await supabase
        .from('bolao_participants')
        .select(`
          *,
          user:profiles!user_id(name, email)
        `)
        .eq('bolao_id', id);

      if (participantsError) throw participantsError;
      setParticipants(participantsData || []);

      // Buscar partidas
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .eq('bolao_id', id)
        .order('match_date', { ascending: true });

      if (matchesError) throw matchesError;
      setMatches(matchesData || []);

      // Buscar palpites do usuário
      if (user) {
        const { data: predictionsData, error: predictionsError } = await supabase
          .from('predictions')
          .select('*')
          .eq('user_id', user.id)
          .in('match_id', (matchesData || []).map(m => m.id));

        if (predictionsError) throw predictionsError;
        setPredictions(predictionsData || []);
      }

    } catch (error) {
      console.error('Erro ao carregar dados do bolão:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMatch = async () => {
    if (!newMatch.team_home || !newMatch.team_away || !newMatch.match_date || !newMatch.match_time) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      const matchDateTime = `${newMatch.match_date}T${newMatch.match_time}:00`;
      
      const { error } = await supabase
        .from('matches')
        .insert({
          bolao_id: id,
          team_home: newMatch.team_home,
          team_away: newMatch.team_away,
          match_date: matchDateTime,
          status: 'scheduled'
        });

      if (error) throw error;

      setNewMatch({ team_home: '', team_away: '', match_date: '', match_time: '' });
      setShowAddMatch(false);
      fetchBolaoData();
    } catch (error) {
      console.error('Erro ao adicionar partida:', error);
      alert('Erro ao adicionar partida');
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta partida?')) return;

    try {
      const { error } = await supabase
        .from('matches')
        .delete()
        .eq('id', matchId);

      if (error) throw error;
      fetchBolaoData();
    } catch (error) {
      console.error('Erro ao excluir partida:', error);
      alert('Erro ao excluir partida');
    }
  };

  const handlePrediction = async (matchId: string, homeScore: number, awayScore: number) => {
    if (!user) return;

    try {
      const existingPrediction = predictions.find(p => p.match_id === matchId);
      
      if (existingPrediction) {
        const { error } = await supabase
          .from('predictions')
          .update({
            predicted_home_score: homeScore,
            predicted_away_score: awayScore
          })
          .eq('id', existingPrediction.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('predictions')
          .insert({
            match_id: matchId,
            user_id: user.id,
            predicted_home_score: homeScore,
            predicted_away_score: awayScore
          });

        if (error) throw error;
      }

      fetchBolaoData();
    } catch (error) {
      console.error('Erro ao salvar palpite:', error);
      alert('Erro ao salvar palpite');
    }
  };

  const getUserPrediction = (matchId: string) => {
    return predictions.find(p => p.match_id === matchId);
  };

  const getParticipantsRanking = () => {
    const ranking = participants.map(participant => {
      const userPredictions = predictions.filter(p => p.user_id === participant.user_id);
      const totalPoints = userPredictions.reduce((sum, p) => sum + p.points, 0);
      
      return {
        ...participant,
        totalPoints
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints);

    return ranking;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/imagem-1.png')" }}>
        <Header />
        <main className="px-8 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-xl [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Carregando...
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!bolao) {
    return (
      <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/imagem-1.png')" }}>
        <Header />
        <main className="px-8 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-xl [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Bolão não encontrado
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/imagem-1.png')" }}>
      <Header />
      
      <div className="relative z-10 px-8 pt-6">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10 pl-0"
          onClick={() => navigate("/todos-boloes")}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar para bolões
        </Button>
      </div>

      <main className="px-8 py-6">
        {/* Header do Bolão */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="grid grid-cols-3 gap-8">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-[#19e519]" />
              <div>
                <p className="text-[#9eb79e] text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  Campeonato
                </p>
                <p className="text-[#111611] font-bold text-lg [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  {bolao.campeonato}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-[#19e519]" />
              <div>
                <p className="text-[#9eb79e] text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  Criado
                </p>
                <p className="text-[#111611] font-bold text-lg [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  {new Date(bolao.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[#19e519]" />
              <div>
                <p className="text-[#9eb79e] text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  Participantes
                </p>
                <p className="text-[#111611] font-bold text-lg [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  {participants.length} pessoas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            className={`h-10 px-6 rounded-lg font-semibold ${
              activeTab === 'partidas'
                ? 'bg-[#14AE5C] hover:bg-[#059749]/90 text-[#ffffff]'
                : 'bg-[#FFF] hover:bg-[#E6E6E6]/90 text-black'
            }`}
            onClick={() => setActiveTab('partidas')}
          >
            Partidas
          </Button>
          <Button
            className={`h-10 px-6 rounded-lg font-semibold ${
              activeTab === 'classificacao'
                ? 'bg-[#14AE5C] hover:bg-[#059749]/90 text-[#ffffff]'
                : 'bg-[#FFF] hover:bg-[#E6E6E6]/90 text-black'
            }`}
            onClick={() => setActiveTab('classificacao')}
          >
            Classificação
          </Button>
          
          {isOwner && activeTab === 'partidas' && (
            <Button
              className="bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611] h-10 px-4 rounded-lg font-semibold ml-auto"
              onClick={() => setShowAddMatch(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Partida
            </Button>
          )}
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'partidas' && (
          <div className="space-y-4">
            {showAddMatch && (
              <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 mb-6">
                <h3 className="text-[#111611] text-lg font-bold mb-4 [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  Adicionar Nova Partida
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Input
                    placeholder="Time da casa"
                    value={newMatch.team_home}
                    onChange={(e) => setNewMatch({...newMatch, team_home: e.target.value})}
                    className="bg-white border-gray-300"
                  />
                  <Input
                    placeholder="Time visitante"
                    value={newMatch.team_away}
                    onChange={(e) => setNewMatch({...newMatch, team_away: e.target.value})}
                    className="bg-white border-gray-300"
                  />
                  <Input
                    type="date"
                    value={newMatch.match_date}
                    onChange={(e) => setNewMatch({...newMatch, match_date: e.target.value})}
                    className="bg-white border-gray-300"
                  />
                  <Input
                    type="time"
                    value={newMatch.match_time}
                    onChange={(e) => setNewMatch({...newMatch, match_time: e.target.value})}
                    className="bg-white border-gray-300"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddMatch}
                    className="bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611]"
                  >
                    Adicionar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddMatch(false)}
                    className="border-gray-300"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {matches.length > 0 ? (
              matches.map((match) => {
                const userPrediction = getUserPrediction(match.id);
                const canPredict = match.status === 'scheduled';
                
                return (
                  <div key={match.id} className="bg-white/95 backdrop-blur-sm rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-[#111611] font-bold text-lg [font-family:'Plus_Jakarta_Sans',Helvetica]">
                            {match.team_home}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[#9eb79e] text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]">
                            X
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[#111611] font-bold text-lg [font-family:'Plus_Jakarta_Sans',Helvetica]">
                            {match.team_away}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[#9eb79e] text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]">
                            {new Date(match.match_date).toLocaleDateString('pt-BR')} às {new Date(match.match_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className={`text-sm font-medium ${
                            match.status === 'finished' ? 'text-gray-600' :
                            match.status === 'live' ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            {match.status === 'finished' ? 'Finalizado' :
                             match.status === 'live' ? 'Ao Vivo' : 'Agendado'}
                          </p>
                        </div>
                        
                        {isOwner && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteMatch(match.id)}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Resultado ou Palpite */}
                    {match.status === 'finished' && match.home_score !== null && match.away_score !== null ? (
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#111611] [font-family:'Plus_Jakarta_Sans',Helvetica]">
                          {match.home_score} x {match.away_score}
                        </p>
                        {userPrediction && (
                          <p className="text-sm text-[#9eb79e] [font-family:'Plus_Jakarta_Sans',Helvetica]">
                            Seu palpite: {userPrediction.predicted_home_score} x {userPrediction.predicted_away_score} 
                            ({userPrediction.points} pontos)
                          </p>
                        )}
                      </div>
                    ) : canPredict ? (
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            className="w-16 text-center"
                            defaultValue={userPrediction?.predicted_home_score || ''}
                            id={`home-${match.id}`}
                          />
                          <span className="text-[#111611] font-bold">X</span>
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            className="w-16 text-center"
                            defaultValue={userPrediction?.predicted_away_score || ''}
                            id={`away-${match.id}`}
                          />
                        </div>
                        <Button
                          size="sm"
                          className="bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611]"
                          onClick={() => {
                            const homeInput = document.getElementById(`home-${match.id}`) as HTMLInputElement;
                            const awayInput = document.getElementById(`away-${match.id}`) as HTMLInputElement;
                            const homeScore = parseInt(homeInput.value) || 0;
                            const awayScore = parseInt(awayInput.value) || 0;
                            handlePrediction(match.id, homeScore, awayScore);
                          }}
                        >
                          {userPrediction ? 'Atualizar' : 'Fazer'} Palpite
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-[#9eb79e] text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]">
                          Palpites encerrados
                        </p>
                        {userPrediction && (
                          <p className="text-sm text-[#111611] [font-family:'Plus_Jakarta_Sans',Helvetica]">
                            Seu palpite: {userPrediction.predicted_home_score} x {userPrediction.predicted_away_score}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <p className="text-white text-lg [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  Nenhuma partida adicionada ainda.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'classificacao' && (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 border-b border-gray-200">
              <div className="text-[#9eb79e] text-sm font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                POSIÇÃO
              </div>
              <div className="text-[#9eb79e] text-sm font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                PARTICIPANTE
              </div>
              <div className="text-[#9eb79e] text-sm font-medium [font-family:'Plus_Jakarta_Sans',Helvetica] text-right">
                PONTUAÇÃO
              </div>
            </div>

            {getParticipantsRanking().map((participant, index) => (
              <div key={participant.id} className="grid grid-cols-3 gap-4 p-4 items-center border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#9eb79e] rounded-full flex items-center justify-center">
                    <span className="text-[#111611] font-bold">
                      {participant.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-[#111611] font-semibold [font-family:'Plus_Jakarta_Sans',Helvetica]">
                      {participant.user?.name || 'Usuário'}
                    </p>
                    {participant.user_id === bolao.creator_id && (
                      <p className="text-[#9eb79e] text-xs [font-family:'Plus_Jakarta_Sans',Helvetica]">
                        Criador
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-[#111611] font-bold text-2xl [font-family:'Plus_Jakarta_Sans',Helvetica]">
                    {participant.totalPoints}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};