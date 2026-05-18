-- supabase/migrations/004_contact_context.sql
CREATE TABLE IF NOT EXISTS contact_context (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id  uuid NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  key         text NOT NULL CHECK (length(key) > 0 AND length(key) <= 50),
  value       text NOT NULL CHECK (length(value) > 0 AND length(value) <= 500),
  source      text NOT NULL DEFAULT 'voice' CHECK (source IN ('voice', 'manual')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own contact_context"
  ON contact_context FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_contact_context_contact_id ON contact_context(contact_id);
CREATE INDEX idx_contact_context_user_id ON contact_context(user_id);
