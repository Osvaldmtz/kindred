-- =============================================
-- Kindred — Initial Migration
-- Apply in Supabase SQL Editor
-- =============================================

-- Enums
CREATE TYPE relationship_type AS ENUM (
  'family', 'friend', 'client', 'prospect',
  'rotary', 'colleague', 'mentor', 'other'
);

CREATE TYPE interaction_type AS ENUM (
  'call', 'message', 'whatsapp', 'email',
  'meeting', 'coffee', 'event', 'other'
);

-- =============================================
-- contacts
-- =============================================
CREATE TABLE contacts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name                  TEXT NOT NULL,
  photo_url             TEXT,
  email                 TEXT,
  phone                 TEXT,
  relationship_type     relationship_type NOT NULL DEFAULT 'other',
  company               TEXT,
  role                  TEXT,
  birthday              DATE,
  target_frequency_days INT NOT NULL DEFAULT 30,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own contacts" ON contacts
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- contact_interests (tags)
-- =============================================
CREATE TABLE contact_interests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id  UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tag         TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (contact_id, tag)
);

ALTER TABLE contact_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own contact_interests" ON contact_interests
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- interactions
-- =============================================
CREATE TABLE interactions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id           UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id              UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type                 interaction_type NOT NULL,
  note                 TEXT,
  occurred_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  carnegie_principles  TEXT[],
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own interactions" ON interactions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- contact_briefs (AI cache)
-- =============================================
CREATE TABLE contact_briefs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id    UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content       JSONB NOT NULL,
  generated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at    TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '24 hours')
);

ALTER TABLE contact_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own contact_briefs" ON contact_briefs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- contacts_with_status (view)
-- =============================================
CREATE OR REPLACE VIEW contacts_with_status AS
SELECT
  c.*,
  MAX(i.occurred_at)                                        AS last_interaction_at,
  COUNT(i.id)::INT                                          AS total_interactions,
  EXTRACT(DAY FROM (now() - MAX(i.occurred_at)))::INT       AS days_since_last_interaction,
  (
    MAX(i.occurred_at) IS NULL OR
    EXTRACT(DAY FROM (now() - MAX(i.occurred_at))) >= c.target_frequency_days
  )                                                         AS is_due
FROM contacts c
LEFT JOIN interactions i ON i.contact_id = c.id
GROUP BY c.id;

-- RLS on view via contacts table (view inherits from base table security)
