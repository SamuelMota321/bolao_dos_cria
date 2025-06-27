import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Header } from "../../components/ui/header";
import { Input } from "../../components/ui/input";
import { ChevronLeft, Plus, Trash2, Users, Calendar, Trophy, Search } from "lucide-react";
import { supabase, Bolao, BolaoParticipant, Match, Prediction } from "../../lib/supabase";
import { UserContext } from "../../providers/UserContext";
import { api } from "../../lib/api";
import { authorization } from "../../lib/utils";
import { ConfirmModal, AlertModal } from "../../components/ui/modal";

interface ApiPartida {
  partida_id: number;
  campeonato: {
    campeonato_id: number;
    nome: string;
    slug: string;
  };
  placar: string;
  time_mandante: {
    time_id: number;
    nome_popular: string;
    sigla: string;
    escudo: string;
  };
  time_visitante: {
    time_id: number;
    nome_popular: string;
    sigla: string;
    escudo: string;
  };
  placar_mandante: number;
  placar_visitante: number;
  status: string;
  slug: string;
  data_realizacao: string;
  hora_realizacao: string;
  data_realizacao_iso: string;
  estadio: {
    estadio_id: number;
    nome_popular: string;
  };
}

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
  const [apiPartidas, setApiPartidas] = useState<ApiPartida[]>([]);
  const [loadingApiPartidas, setLoadingApiPartidas] = useState(false);
  const [searchApiPartidas, setSearchApiPartidas] = useState("");
  const [addingMatch, setAddingMatch] = useState(false);
  const [predictionInputs, setPredictionInputs] = useState<{[key: string]: {home: string, away: string}}>({});

  // Estados para modais
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'info'
  });

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const isOwner = user && bolao && user.id === bolao.creator_id;

  useEffect(() => {
    if (id) {
      fetchBolaoData();
    }
  }, [id]);

  useEffect(() => {
    if (showAddMatch) {
      fetchApiPartidas();
    }
  }, [showAddMatch]);

  // Inicializar inputs de palpites quando as partidas carregarem
  useEffect(() => {
    const initialInputs: {[key: string]: {home: string, away: string}} = {};
    matches.forEach(match => {
      const userPrediction = predictions.find(p => p.match_id === match.id && p.user_id === user?.id);
      initialInputs[match.id] = {
        home: userPrediction?.predicted_home_score?.toString() || '',
        away: userPrediction?.predicted_away_score?.toString() || ''
      };
    });
    setPredictionInputs(initialInputs);
  }, [matches, predictions, user?.id]);

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'warning' | 'info' = 'info') => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      type
    });
  };

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

      // Buscar TODOS os palpites para calcular ranking corretamente
      const { data: allPredictionsData, error: allPredictionsError } = await supabase
        .from('predictions')
        .select(`
          *,
          user:profiles!user_id(name, email)
        `)
        .in('match_id', (matchesData || []).map(m => m.id));

      if (allPredictionsError) throw allPredictionsError;
      setPredictions(allPredictionsData || []);

    } catch (error) {
      console.error('Erro ao carregar dados do bolão:', error);
      showAlert('Erro', 'Erro ao carregar dados do bolão', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchApiPartidas = async () => {
    try {
      setLoadingApiPartidas(true);
      const { data } = await api.get('/ao-vivo', authorization);
      
      // Filtrar apenas partidas ao vivo
      const partidasAoVivo = data.filter((partida: ApiPartida) => partida.status === 'andamento');
      setApiPartidas(partidasAoVivo);
    } catch (error) {
      console.error('Erro ao carregar partidas da API:', error);
      setApiPartidas([]);
      showAlert('Erro', 'Erro ao carregar partidas da API', 'error');
    } finally {
      setLoadingApiPartidas(false);
    }
  };

  const handleAddApiMatch = async (apiPartida: ApiPartida) => {
    if (addingMatch) return; // Prevenir múltiplos cliques
    
    try {
      setAddingMatch(true);
      
      // Verificar se a partida já foi adicionada
      const existingMatch = matches.find(m => 
        m.team_home === apiPartida.time_mandante.nome_popular && 
        m.team_away === apiPartida.time_visitante.nome_popular
      );

      if (existingMatch) {
        showAlert('Aviso', 'Esta partida já foi adicionada ao bolão', 'info');
        return;
      }

      const matchDateTime = apiPartida.data_realizacao_iso;
      
      const { error } = await supabase
        .from('matches')
        .insert({
          bolao_id: id,
          team_home: apiPartida.time_mandante.nome_popular,
          team_away: apiPartida.time_visitante.nome_popular,
          match_date: matchDateTime,
          home_score: apiPartida.placar_mandante,
          away_score: apiPartida.placar_visitante,
          status: apiPartida.status === 'andamento' ? 'live' : 
                  apiPartida.status === 'finalizado' ? 'finished' : 'scheduled'
        });

      if (error) throw error;

      // Recarregar dados sem fechar o modal
      await fetchBolaoData();
      showAlert('Sucesso', 'Partida adicionada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao adicionar partida:', error);
      showAlert('Erro', 'Erro ao adicionar partida', 'error');
    } finally {
      setAddingMatch(false);
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    showConfirm(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta partida? Esta ação não pode ser desfeita.',
      async () => {
        try {
          const { error } = await supabase
            .from('matches')
            .delete()
            .eq('id', matchId);

          if (error) throw error;
          await fetchBolaoData();
          showAlert('Sucesso', 'Partida excluída com sucesso!', 'success');
        } catch (error) {
          console.error('Erro ao excluir partida:', error);
          showAlert('Erro', 'Erro ao excluir partida', 'error');
        }
      },
      'danger'
    );
  };

  const handlePredictionInputChange = (matchId: string, field: 'home' | 'away', value: string) => {
    // Permitir apenas números e limitar a 2 dígitos
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 2);
    
    setPredictionInputs(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [field]: numericValue
      }
    }));
  };

  const handlePrediction = async (matchId: string) => {
    if (!user) return;

    const inputs = predictionInputs[matchId];
    if (!inputs) return;

    const homeScore = parseInt(inputs.home) || 0;
    const awayScore = parseInt(inputs.away) || 0;

    if (homeScore < 0 || awayScore < 0 || homeScore > 20 || awayScore > 20) {
      showAlert('Erro de Validação', 'Os placares devem estar entre 0 e 20', 'error');
      return;
    }

    if (inputs.home === '' || inputs.away === '') {
      showAlert('Erro de Validação', 'Por favor, preencha ambos os placares', 'error');
      return;
    }

    try {
      const existingPrediction = predictions.find(p => p.match_id === matchId && p.user_id === user.id);
      
      if (existingPrediction) {
        const { error } = await supabase
          .from('predictions')
          .update({
            predicted_home_score: homeScore,
            predicted_away_score: awayScore
          })
          .eq('id', existingPrediction.id);

        if (error) throw error;
        showAlert('Sucesso', 'Palpite atualizado com sucesso!', 'success');
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
        showAlert('Sucesso', 'Palpite salvo com sucesso!', 'success');
      }

      await fetchBolaoData();
    } catch (error) {
      console.error('Erro ao salvar palpite:', error);
      showAlert('Erro', 'Erro ao salvar palpite', 'error');
    }
  };

  const getUserPrediction = (matchId: string) => {
    return predictions.find(p => p.match_id === matchId && p.user_id === user?.id);
  };

  const getParticipantsRanking = () => {
    const ranking = participants.map(participant => {
      const userPredictions = predictions.filter(p => p.user_id === participant.user_id);
      const totalPoints = userPredictions.reduce((sum, p) => sum + (p.points || 0), 0);
      
      return {
        ...participant,
        totalPoints
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints);

    return ranking;
  };

  const filteredApiPartidas = apiPartidas.filter(partida =>
    partida.time_mandante.nome_popular.toLowerCase().includes(searchApiPartidas.toLowerCase()) ||
    partida.time_visitante.nome_popular.toLowerCase().includes(searchApiPartidas.toLowerCase()) ||
    partida.campeonato.nome.toLowerCase().includes(searchApiPartidas.toLowerCase())
  );

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
          <div className="mb-4">
            <h1 className="text-[#111611] text-2xl font-bold [font-family:'Plus_Jakarta_Sans',Helvetica]">
              {bolao.name}
            </h1>
            <p className="text-[#9eb79e] text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Criado por {bolao.creator?.name || 'Usuário'}
            </p>
          </div>
          
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[#111611] text-lg font-bold [font-family:'Plus_Jakarta_Sans',Helvetica]">
                    Adicionar Partida ao Vivo
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddMatch(false)}
                    className="border-gray-300"
                  >
                    Cancelar
                  </Button>
                </div>

                <p className="text-[#9eb79e] text-sm mb-4 [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  Selecione uma partida que está acontecendo ao vivo para adicionar ao bolão:
                </p>

                {/* Busca */}
                <div className="relative mb-4">
                  <Input
                    className="bg-white border-gray-300 pl-10 pr-4 h-10 rounded-lg"
                    placeholder="Buscar partida..."
                    value={searchApiPartidas}
                    onChange={(e) => setSearchApiPartidas(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                </div>

                {loadingApiPartidas ? (
                  <div className="text-center py-8">
                    <p className="text-[#9eb79e] [font-family:'Plus_Jakarta_Sans',Helvetica]">
                      Carregando partidas ao vivo...
                    </p>
                  </div>
                ) : filteredApiPartidas.length > 0 ? (
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {filteredApiPartidas.map((partida) => {
                      const isAlreadyAdded = matches.some(m => 
                        m.team_home === partida.time_mandante.nome_popular && 
                        m.team_away === partida.time_visitante.nome_popular
                      );
                      
                      return (
                        <div key={partida.partida_id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-2">
                                <img
                                  src={partida.time_mandante.escudo}
                                  alt={partida.time_mandante.nome_popular}
                                  className="w-8 h-8 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = '/chatgpt-image-6-de-mai--de-2025--16-00-29-1-1.png';
                                  }}
                                />
                                <span className="text-[#111611] font-semibold [font-family:'Plus_Jakarta_Sans',Helvetica]">
                                  {partida.time_mandante.nome_popular}
                                </span>
                                <span className="text-2xl font-bold text-[#111611] [font-family:'Plus_Jakarta_Sans',Helvetica]">
                                  {partida.placar_mandante}
                                </span>
                                <span className="text-[#9eb79e] font-bold">x</span>
                                <span className="text-2xl font-bold text-[#111611] [font-family:'Plus_Jakarta_Sans',Helvetica]">
                                  {partida.placar_visitante}
                                </span>
                                <span className="text-[#111611] font-semibold [font-family:'Plus_Jakarta_Sans',Helvetica]">
                                  {partida.time_visitante.nome_popular}
                                </span>
                                <img
                                  src={partida.time_visitante.escudo}
                                  alt={partida.time_visitante.nome_popular}
                                  className="w-8 h-8 object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = '/chatgpt-image-6-de-mai--de-2025--16-00-29-1-1.png';
                                  }}
                                />
                              </div>
                              <div className="flex items-center gap-4 text-sm text-[#9eb79e] [font-family:'Plus_Jakarta_Sans',Helvetica]">
                                <span>{partida.campeonato.nome}</span>
                                <span>•</span>
                                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                  AO VIVO
                                </span>
                                <span>•</span>
                                <span>{partida.estadio.nome_popular}</span>
                              </div>
                            </div>
                            {isAlreadyAdded ? (
                              <span className="text-[#9eb79e] text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]">
                                Já adicionada
                              </span>
                            ) : (
                              <Button
                                size="sm"
                                disabled={addingMatch}
                                className="bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611] disabled:opacity-50"
                                onClick={() => handleAddApiMatch(partida)}
                              >
                                {addingMatch ? 'Adicionando...' : 'Adicionar'}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-[#9eb79e] [font-family:'Plus_Jakarta_Sans',Helvetica]">
                      {searchApiPartidas 
                        ? `Nenhuma partida ao vivo encontrada para "${searchApiPartidas}"`
                        : 'Nenhuma partida ao vivo disponível no momento'
                      }
                    </p>
                  </div>
                )}
              </div>
            )}

            {matches.length > 0 ? (
              matches.map((match) => {
                const userPrediction = getUserPrediction(match.id);
                const canPredict = match.status === 'scheduled' || match.status === 'live';
                const inputs = predictionInputs[match.id] || { home: '', away: '' };
                
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
                    ) : match.status === 'live' && match.home_score !== null && match.away_score !== null ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[#111611] [font-family:'Plus_Jakarta_Sans',Helvetica]">
                            {match.home_score} x {match.away_score}
                          </p>
                          <p className="text-sm text-green-600 font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                            Partida em andamento
                          </p>
                        </div>
                        
                        {/* Permitir palpites mesmo em partidas ao vivo */}
                        <div className="flex items-center justify-center gap-4">
                          <div className="flex items-center gap-2">
                            <Input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={2}
                              className="w-16 text-center"
                              value={inputs.home}
                              onChange={(e) => handlePredictionInputChange(match.id, 'home', e.target.value)}
                              placeholder="0"
                            />
                            <span className="text-[#111611] font-bold">X</span>
                            <Input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={2}
                              className="w-16 text-center"
                              value={inputs.away}
                              onChange={(e) => handlePredictionInputChange(match.id, 'away', e.target.value)}
                              placeholder="0"
                            />
                          </div>
                          <Button
                            size="sm"
                            className="bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611]"
                            onClick={() => handlePrediction(match.id)}
                          >
                            {userPrediction ? 'Atualizar' : 'Fazer'} Palpite
                          </Button>
                        </div>
                        
                        {userPrediction && (
                          <p className="text-sm text-[#9eb79e] text-center [font-family:'Plus_Jakarta_Sans',Helvetica]">
                            Palpite atual: {userPrediction.predicted_home_score} x {userPrediction.predicted_away_score}
                          </p>
                        )}
                      </div>
                    ) : canPredict ? (
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={2}
                            className="w-16 text-center"
                            value={inputs.home}
                            onChange={(e) => handlePredictionInputChange(match.id, 'home', e.target.value)}
                            placeholder="0"
                          />
                          <span className="text-[#111611] font-bold">X</span>
                          <Input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={2}
                            className="w-16 text-center"
                            value={inputs.away}
                            onChange={(e) => handlePredictionInputChange(match.id, 'away', e.target.value)}
                            placeholder="0"
                          />
                        </div>
                        <Button
                          size="sm"
                          className="bg-[#19e519] hover:bg-[#19e519]/90 text-[#111611]"
                          onClick={() => handlePrediction(match.id)}
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
                <img
                  src="/chatgpt-image-6-de-mai--de-2025--16-00-29-1-1.png"
                  alt="Nenhuma partida"
                  className="w-32 h-32 mx-auto mb-6"
                />
                <p className="text-white text-lg [font-family:'Plus_Jakarta_Sans',Helvetica] mb-4">
                  Nenhuma partida adicionada ainda.
                </p>
                {isOwner && (
                  <p className="text-[#9eb79e] text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]">
                    Clique em "Adicionar Partida" para incluir partidas ao vivo no bolão.
                  </p>
                )}
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

      {/* Modais */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.type === 'danger' ? 'Excluir' : 'Confirmar'}
      />

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal(prev => ({ ...prev, isOpen: false }))}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
      />
    </div>
  );
};