-- Calendar subscription RPC: returns tasks for a user identified by their calendar_token.
-- SECURITY DEFINER runs as the function owner (postgres), bypassing RLS.
-- The token acts as the authentication credential for this public endpoint.

CREATE OR REPLACE FUNCTION public.get_tasks_by_calendar_token(p_token uuid)
RETURNS TABLE(
  id uuid,
  name text,
  description text,
  due_date date,
  priority text,
  column_name text,
  board_name text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    t.id, t.name, t.description, t.due_date, t.priority,
    c.name AS column_name,
    b.name AS board_name
  FROM tasks t
  JOIN columns c ON c.id = t.column_id
  JOIN boards b ON b.id = c.board_id
  JOIN profiles p ON p.id = b.user_id
  WHERE p.calendar_token = p_token
    AND t.due_date IS NOT NULL;
$$;

GRANT EXECUTE ON FUNCTION public.get_tasks_by_calendar_token TO anon;
