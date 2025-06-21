/*
  # Criar tabelas de usuários e bolões

  1. Novas Tabelas
    - `profiles` - Perfis dos usuários
      - `id` (uuid, chave primária, referência ao auth.users)
      - `name` (text, nome do usuário)
      - `email` (text, email único)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `boloes` - Bolões criados
      - `id` (uuid, chave primária)
      - `name` (text, nome do bolão)
      - `password` (text, senha do bolão)
      - `campeonato` (text, campeonato selecionado)
      - `creator_id` (uuid, referência ao usuário criador)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `bolao_participants` - Participantes dos bolões
      - `id` (uuid, chave primária)
      - `bolao_id` (uuid, referência ao bolão)
      - `user_id` (uuid, referência ao usuário)
      - `joined_at` (timestamp)

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Políticas para usuários autenticados acessarem seus próprios dados
    - Políticas para gerenciar bolões e participações
*/

-- Criar tabela de perfis
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de bolões
CREATE TABLE IF NOT EXISTS boloes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  password text NOT NULL,
  campeonato text NOT NULL,
  creator_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de participantes dos bolões
CREATE TABLE IF NOT EXISTS bolao_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bolao_id uuid NOT NULL REFERENCES boloes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(bolao_id, user_id)
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE boloes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bolao_participants ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Políticas para bolões
CREATE POLICY "Users can read boloes they participate in"
  ON boloes
  FOR SELECT
  TO authenticated
  USING (
    creator_id = auth.uid() OR
    id IN (
      SELECT bolao_id FROM bolao_participants 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read all boloes for joining"
  ON boloes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create boloes"
  ON boloes
  FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Creators can update their boloes"
  ON boloes
  FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid());

CREATE POLICY "Creators can delete their boloes"
  ON boloes
  FOR DELETE
  TO authenticated
  USING (creator_id = auth.uid());

-- Políticas para participantes
CREATE POLICY "Users can read participants of boloes they're in"
  ON bolao_participants
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    bolao_id IN (
      SELECT id FROM boloes WHERE creator_id = auth.uid()
    ) OR
    bolao_id IN (
      SELECT bolao_id FROM bolao_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join boloes"
  ON bolao_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave boloes"
  ON bolao_participants
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boloes_updated_at
  BEFORE UPDATE ON boloes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();