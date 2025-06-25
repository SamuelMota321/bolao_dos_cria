/*
  # Sistema completo de partidas e palpites

  1. New Tables
    - `matches` - Partidas dos bolões
      - `id` (uuid, primary key)
      - `bolao_id` (uuid, foreign key)
      - `team_home` (text)
      - `team_away` (text)
      - `match_date` (timestamp)
      - `home_score` (integer, nullable)
      - `away_score` (integer, nullable)
      - `status` (text) - 'scheduled', 'live', 'finished'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `predictions` - Palpites dos usuários
      - `id` (uuid, primary key)
      - `match_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `predicted_home_score` (integer)
      - `predicted_away_score` (integer)
      - `points` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
    - Users can only edit their own predictions
    - Only bolao creators can manage matches

  3. Functions
    - Function to calculate points based on prediction accuracy
    - Trigger to update points when match results are finalized
*/

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bolao_id uuid NOT NULL REFERENCES boloes(id) ON DELETE CASCADE,
  team_home text NOT NULL,
  team_away text NOT NULL,
  match_date timestamptz NOT NULL,
  home_score integer,
  away_score integer,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  predicted_home_score integer NOT NULL,
  predicted_away_score integer NOT NULL,
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(match_id, user_id)
);

-- Enable RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Policies for matches table
CREATE POLICY "Users can read all matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Bolao creators can insert matches"
  ON matches
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boloes 
      WHERE boloes.id = bolao_id 
      AND boloes.creator_id = auth.uid()
    )
  );

CREATE POLICY "Bolao creators can update matches"
  ON matches
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM boloes 
      WHERE boloes.id = bolao_id 
      AND boloes.creator_id = auth.uid()
    )
  );

CREATE POLICY "Bolao creators can delete matches"
  ON matches
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM boloes 
      WHERE boloes.id = bolao_id 
      AND boloes.creator_id = auth.uid()
    )
  );

-- Policies for predictions table
CREATE POLICY "Users can read all predictions"
  ON predictions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own predictions"
  ON predictions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own predictions"
  ON predictions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own predictions"
  ON predictions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Function to calculate points
CREATE OR REPLACE FUNCTION calculate_prediction_points(
  predicted_home integer,
  predicted_away integer,
  actual_home integer,
  actual_away integer
) RETURNS integer AS $$
DECLARE
  predicted_diff integer;
  actual_diff integer;
  points integer := 0;
BEGIN
  -- If exact match, return 10 points
  IF predicted_home = actual_home AND predicted_away = actual_away THEN
    RETURN 10;
  END IF;
  
  -- If one score is correct, return 5 points
  IF predicted_home = actual_home OR predicted_away = actual_away THEN
    RETURN 5;
  END IF;
  
  -- Calculate goal differences
  predicted_diff := predicted_home - predicted_away;
  actual_diff := actual_home - actual_away;
  
  -- If difference is exactly 1 goal off, return 2 points
  IF ABS(predicted_diff - actual_diff) = 1 THEN
    RETURN 2;
  END IF;
  
  -- If more than 1 goal off, return 1 point
  IF ABS(predicted_diff - actual_diff) > 1 THEN
    RETURN 1;
  END IF;
  
  RETURN points;
END;
$$ LANGUAGE plpgsql;

-- Function to update prediction points when match is finished
CREATE OR REPLACE FUNCTION update_prediction_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update points when match status changes to 'finished' and scores are set
  IF NEW.status = 'finished' AND NEW.home_score IS NOT NULL AND NEW.away_score IS NOT NULL THEN
    UPDATE predictions 
    SET points = calculate_prediction_points(
      predicted_home_score,
      predicted_away_score,
      NEW.home_score,
      NEW.away_score
    ),
    updated_at = now()
    WHERE match_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update points when match is finished
CREATE TRIGGER update_prediction_points_trigger
  AFTER UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_prediction_points();

-- Add updated_at triggers
CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_predictions_updated_at
  BEFORE UPDATE ON predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();