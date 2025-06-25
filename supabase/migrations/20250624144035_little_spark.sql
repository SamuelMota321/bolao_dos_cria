/*
  # Fix RLS infinite recursion on bolao_participants

  1. Problem
    - The current RLS policy on bolao_participants creates infinite recursion
    - Policy references both boloes and bolao_participants tables in a circular way

  2. Solution
    - Simplify the bolao_participants SELECT policy to avoid circular references
    - Remove complex subqueries that cause the recursion
    - Keep security intact while breaking the circular dependency

  3. Changes
    - Drop existing problematic SELECT policy on bolao_participants
    - Create new simplified SELECT policy that doesn't cause recursion
    - Maintain security by allowing users to see participants of boloes they're involved with
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Users can read participants of boloes they're in" ON bolao_participants;

-- Create a simplified policy that doesn't cause recursion
-- Users can read participants if they are the participant themselves
-- OR if they are reading participants of a bolao they created (checked via direct creator_id match)
CREATE POLICY "Users can read bolao participants" 
  ON bolao_participants 
  FOR SELECT 
  TO authenticated 
  USING (
    user_id = auth.uid() 
    OR 
    EXISTS (
      SELECT 1 FROM boloes 
      WHERE boloes.id = bolao_participants.bolao_id 
      AND boloes.creator_id = auth.uid()
    )
  );