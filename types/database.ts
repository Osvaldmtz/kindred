// This file will be replaced by the auto-generated Supabase types.
// Run: npx supabase gen types typescript --project-id <project-id> > types/database.ts
// After applying the migration in Supabase SQL Editor.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          photo_url: string | null;
          email: string | null;
          phone: string | null;
          relationship_type: RelationshipType;
          company: string | null;
          role: string | null;
          birthday: string | null;
          target_frequency_days: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          photo_url?: string | null;
          email?: string | null;
          phone?: string | null;
          relationship_type?: RelationshipType;
          company?: string | null;
          role?: string | null;
          birthday?: string | null;
          target_frequency_days?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contacts"]["Insert"]>;
      };
      contact_interests: {
        Row: {
          id: string;
          contact_id: string;
          user_id: string;
          tag: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          contact_id: string;
          user_id: string;
          tag: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_interests"]["Insert"]>;
      };
      interactions: {
        Row: {
          id: string;
          contact_id: string;
          user_id: string;
          type: InteractionType;
          note: string | null;
          occurred_at: string;
          carnegie_principles: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          contact_id: string;
          user_id: string;
          type: InteractionType;
          note?: string | null;
          occurred_at?: string;
          carnegie_principles?: string[] | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["interactions"]["Insert"]>;
      };
      contact_briefs: {
        Row: {
          id: string;
          contact_id: string;
          user_id: string;
          content: ContactBriefContent;
          generated_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          contact_id: string;
          user_id: string;
          content: ContactBriefContent;
          generated_at?: string;
          expires_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_briefs"]["Insert"]>;
      };
    };
    Views: {
      contacts_with_status: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          photo_url: string | null;
          email: string | null;
          phone: string | null;
          relationship_type: RelationshipType;
          company: string | null;
          role: string | null;
          birthday: string | null;
          target_frequency_days: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
          last_interaction_at: string | null;
          total_interactions: number;
          days_since_last_interaction: number | null;
          is_due: boolean;
        };
      };
    };
    Enums: {
      relationship_type: RelationshipType;
      interaction_type: InteractionType;
    };
  };
};

export type RelationshipType =
  | "family"
  | "friend"
  | "client"
  | "prospect"
  | "rotary"
  | "colleague"
  | "mentor"
  | "other";

export type InteractionType =
  | "call"
  | "message"
  | "whatsapp"
  | "email"
  | "meeting"
  | "coffee"
  | "event"
  | "other";

export type ContactBriefContent = {
  summary: string;
  connection_points: string[];
  questions_to_ask: string[];
  carnegie_tips: string[];
  warning: string | null;
};

export type Contact = Database["public"]["Tables"]["contacts"]["Row"];
export type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"];
export type ContactUpdate = Database["public"]["Tables"]["contacts"]["Update"];
export type Interaction = Database["public"]["Tables"]["interactions"]["Row"];
export type InteractionInsert = Database["public"]["Tables"]["interactions"]["Insert"];
export type ContactWithStatus = Database["public"]["Views"]["contacts_with_status"]["Row"];
