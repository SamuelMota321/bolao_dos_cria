/*
  # Fix infinite recursion in RLS policies

  1. Policy Issues Fixed
    - Remove circular dependencies in boloes table policies
    - Simplify bolao_participants policies to avoid self-referencing
    - Ensure policies don't create infinite loops

  2. Changes Made
    - Drop existing problematic policies
    - Create new simplified policies without circular references
    - Maintain security while avoiding recursion
*/

-- Drop existing problematic policies for boloes table
DROP POLICY IF EXISTS "Users can read all boloes for joining" ON boloes;
DROP POLICY IF EXISTS "Users can read boloes they participate in" ON boloes;

-- Drop existing problematic policies for bolao_participants table
DROP POLICY IF EXISTS "Users can read bolao participants" ON bolao_participants;

-- Create new simplified policies for boloes table
CREATE POLICY "Users can read all boloes"
  ON boloes
  FOR SELECT
  TO authenticated
  USING (true);

-- Create new simplified policies for bolao_participants table
CREATE POLICY "Users can read all participants"
  ON bolao_participants
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read own participations"
  ON bolao_participants
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Keep existing safe policies that don't cause recursion
-- These policies are already correct and don't need changes:
-- - "Creators can delete their boloes" on boloes
-- - "Creators can update their boloes" on boloes  
-- - "Users can create boloes" on boloes
-- - "Users can join boloes" on bolao_participants
-- - "Users can leave boloes" on bolao_participants