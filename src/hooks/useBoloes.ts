import { useState, useEffect, useContext } from 'react';
import { supabase, Bolao } from '../lib/supabase';
import { UserContext } from '../providers/UserContext';

export const useBoloes = () => {
  const { user } = useContext(UserContext);
  const [boloes, setBoloes] = useState<Bolao[]>([]);
  const [meusBoloes, setMeusBoloes] = useState<Bolao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllBoloes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('boloes')
        .select(`
          *,
          creator:profiles!creator_id(name, email),
          participants_count:bolao_participants(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Processar contagem de participantes
      const processedData = data?.map(bolao => ({
        ...bolao,
        participants_count: bolao.participants_count?.[0]?.count || 0
      })) || [];

      setBoloes(processedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeusBoloes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Buscar bolões criados pelo usuário
      const { data: createdBoloes, error: createdError } = await supabase
        .from('boloes')
        .select(`
          *,
          creator:profiles!creator_id(name, email),
          participants_count:bolao_participants(count)
        `)
        .eq('creator_id', user.id);

      if (createdError) throw createdError;

      // Buscar bolões que o usuário participa
      const { data: participatingBoloes, error: participatingError } = await supabase
        .from('bolao_participants')
        .select(`
          bolao:boloes(
            *,
            creator:profiles!creator_id(name, email),
            participants_count:bolao_participants(count)
          )
        `)
        .eq('user_id', user.id);

      if (participatingError) throw participatingError;

      // Combinar e remover duplicatas
      const allUserBoloes = [
        ...(createdBoloes || []),
        ...(participatingBoloes?.map(p => p.bolao).filter(Boolean) || [])
      ];

      const uniqueBoloes = allUserBoloes.filter((bolao, index, self) => 
        index === self.findIndex(b => b.id === bolao.id)
      );

      // Processar contagem de participantes
      const processedData = uniqueBoloes.map(bolao => ({
        ...bolao,
        participants_count: bolao.participants_count?.[0]?.count || 0
      }));

      setMeusBoloes(processedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createBolao = async (bolaoData: {
    name: string;
    password: string;
    campeonato: string;
  }) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('boloes')
        .insert({
          name: bolaoData.name,
          password: bolaoData.password,
          campeonato: bolaoData.campeonato,
          creator_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Adicionar o criador como participante
      const { error: participantError } = await supabase
        .from('bolao_participants')
        .insert({
          bolao_id: data.id,
          user_id: user.id,
        });

      if (participantError) throw participantError;

      await fetchMeusBoloes();
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinBolao = async (bolaoId: string, password: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      setLoading(true);
      setError(null);

      // Verificar se o bolão existe e a senha está correta
      const { data: bolao, error: bolaoError } = await supabase
        .from('boloes')
        .select('*')
        .eq('id', bolaoId)
        .eq('password', password)
        .single();

      if (bolaoError || !bolao) {
        throw new Error('Bolão não encontrado ou senha incorreta');
      }

      // Verificar se já participa
      const { data: existing } = await supabase
        .from('bolao_participants')
        .select('*')
        .eq('bolao_id', bolaoId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        throw new Error('Você já participa deste bolão');
      }

      // Adicionar como participante
      const { error: participantError } = await supabase
        .from('bolao_participants')
        .insert({
          bolao_id: bolaoId,
          user_id: user.id,
        });

      if (participantError) throw participantError;

      await fetchMeusBoloes();
      return bolao;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const joinBolaoByPassword = async (password: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    try {
      setLoading(true);
      setError(null);

      // Buscar bolão pela senha
      const { data: bolao, error: bolaoError } = await supabase
        .from('boloes')
        .select('*')
        .eq('password', password)
        .single();

      if (bolaoError || !bolao) {
        throw new Error('Senha do bolão incorreta');
      }

      // Verificar se já participa
      const { data: existing } = await supabase
        .from('bolao_participants')
        .select('*')
        .eq('bolao_id', bolao.id)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        throw new Error('Você já participa deste bolão');
      }

      // Adicionar como participante
      const { error: participantError } = await supabase
        .from('bolao_participants')
        .insert({
          bolao_id: bolao.id,
          user_id: user.id,
        });

      if (participantError) throw participantError;

      await fetchMeusBoloes();
      return bolao;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMeusBoloes();
    }
  }, [user]);

  return {
    boloes,
    meusBoloes,
    loading,
    error,
    fetchAllBoloes,
    fetchMeusBoloes,
    createBolao,
    joinBolao,
    joinBolaoByPassword,
  };
};