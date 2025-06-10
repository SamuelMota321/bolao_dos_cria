import React, { useState, useEffect } from "react";
import { Header } from "../../components/ui/header";
import { Input } from "../../components/ui/input";
import { Search, Clock, Trophy } from "lucide-react";

interface Campeonato {
  campeonato_id: number;
  nome: string;
  slug: string;
}

interface Time {
  time_id: number;
  nome_popular: string;
  sigla: string;
  escudo: string;
}

interface Estadio {
  estadio_id: number;
  nome_popular: string;
}

interface DisputaPenalti {
  placar_penalti_mandante: number;
  placar_penalti_visitante: number;
  cobrancas: Array<{
    atleta: {
      atleta_id: number;
      nome_popular: string;
    };
    time: Time;
    status: string;
  }>;
}

interface Partida {
  partida_id: number;
  campeonato: Campeonato;
  placar: string;
  time_mandante: Time;
  time_visitante: Time;
  placar_mandante: number;
  placar_visitante: number;
  disputa_penalti: DisputaPenalti | false;
  status: string;
  slug: string;
  data_realizacao: string;
  hora_realizacao: string;
  data_realizacao_iso: string;
  estadio: Estadio;
  _link: string;
}

export const Partidas = (): JSX.Element => {
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPartidas = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.api-futebol.com.br/v1/ao-vivo');
        
        if (!response.ok) {
          throw new Error('Erro ao carregar partidas');
        }
        
        const data = await response.json();
        setPartidas(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchPartidas();
  }, []);

  const filteredPartidas = partidas.filter(partida =>
    partida.time_mandante.nome_popular.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partida.time_visitante.nome_popular.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partida.campeonato.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'andamento':
        return 'bg-green-500';
      case 'finalizado':
        return 'bg-gray-500';
      case 'agendado':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'andamento':
        return 'AO VIVO';
      case 'finalizado':
        return 'FINALIZADO';
      case 'agendado':
        return 'AGENDADO';
      default:
        return status.toUpperCase();
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/imagem-1.png')" }}
      >
        <Header />
        <main className="px-8 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-xl [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Carregando partidas...
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/imagem-1.png')" }}
      >
        <Header />
        <main className="px-8 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-xl [font-family:'Plus_Jakarta_Sans',Helvetica]">
              Erro ao carregar partidas: {error}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/imagem-1.png')" }}
    >
      <Header />
      
      <main className="px-8 py-6">
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold mb-4 [font-family:'Plus_Jakarta_Sans',Helvetica]">
            Partidas ao Vivo
          </h1>
          <p className="text-white text-lg mb-6 [font-family:'Plus_Jakarta_Sans',Helvetica]">
            Acompanhe os jogos em tempo real
          </p>
          
          <div className="relative max-w-2xl">
            <Input
              className="bg-white border-none text-black pl-12 pr-4 h-12 rounded-lg text-base"
              placeholder="Buscar por time ou campeonato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>
        </div>

        {/* Partidas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartidas.map((partida) => (
            <div key={partida.partida_id} className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              {/* Header do Card */}
              <div className="bg-[#111611] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#19e519]" />
                    <span className="text-white text-sm font-medium [font-family:'Plus_Jakarta_Sans',Helvetica]">
                      {partida.campeonato.nome}
                    </span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(partida.status)}`}>
                    {getStatusText(partida.status)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-[#9eb79e] text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{partida.data_realizacao} - {partida.hora_realizacao}</span>
                </div>
              </div>

              {/* Conteúdo do Jogo */}
              <div className="p-6">
                {/* Times e Placar */}
                <div className="flex items-center justify-between mb-4">
                  {/* Time Mandante */}
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={partida.time_mandante.escudo}
                      alt={partida.time_mandante.nome_popular}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/chatgpt-image-6-de-mai--de-2025--16-00-29-1-1.png';
                      }}
                    />
                    <div>
                      <p className="text-[#111611] font-semibold text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]">
                        {partida.time_mandante.nome_popular}
                      </p>
                      <p className="text-gray-500 text-xs [font-family:'Plus_Jakarta_Sans',Helvetica]">
                        {partida.time_mandante.sigla}
                      </p>
                    </div>
                  </div>

                  {/* Placar */}
                  <div className="text-center mx-4">
                    <div className="text-2xl font-bold text-[#111611] [font-family:'Plus_Jakarta_Sans',Helvetica]">
                      {partida.placar_mandante} x {partida.placar_visitante}
                    </div>
                    {partida.disputa_penalti && (
                      <div className="text-sm text-gray-600 [font-family:'Plus_Jakarta_Sans',Helvetica]">
                        Pênaltis: {partida.disputa_penalti.placar_penalti_mandante} x {partida.disputa_penalti.placar_penalti_visitante}
                      </div>
                    )}
                  </div>

                  {/* Time Visitante */}
                  <div className="flex items-center gap-3 flex-1 justify-end">
                    <div className="text-right">
                      <p className="text-[#111611] font-semibold text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]">
                        {partida.time_visitante.nome_popular}
                      </p>
                      <p className="text-gray-500 text-xs [font-family:'Plus_Jakarta_Sans',Helvetica]">
                        {partida.time_visitante.sigla}
                      </p>
                    </div>
                    <img
                      src={partida.time_visitante.escudo}
                      alt={partida.time_visitante.nome_popular}
                      className="w-10 h-10 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/chatgpt-image-6-de-mai--de-2025--16-00-29-1-1.png';
                      }}
                    />
                  </div>
                </div>

                {/* Estádio */}
                <div className="text-center text-gray-600 text-sm [font-family:'Plus_Jakarta_Sans',Helvetica]">
                  {partida.estadio.nome_popular}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPartidas.length === 0 && !loading && (
          <div className="text-center py-12">
            <img
              src="/chatgpt-image-6-de-mai--de-2025--16-00-29-1-1.png"
              alt="Nenhuma partida"
              className="w-32 h-32 mx-auto mb-6"
            />
            <p className="text-white text-lg [font-family:'Plus_Jakarta_Sans',Helvetica]">
              {searchTerm ? `Nenhuma partida encontrada para "${searchTerm}"` : "Nenhuma partida ao vivo no momento"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};