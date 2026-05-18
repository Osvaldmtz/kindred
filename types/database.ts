// AUTO-GENERATED — do not edit manually.
// Regenerate with: npx supabase gen types typescript --project-id kgtnabaykmdpazguvfou > types/database.ts
// Or via the Supabase MCP tool: generate_typescript_types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      contact_briefs: {
        Row: {
          contact_id: string
          content: Json
          expires_at: string
          generated_at: string
          id: string
          user_id: string
        }
        Insert: {
          contact_id: string
          content: Json
          expires_at?: string
          generated_at?: string
          id?: string
          user_id: string
        }
        Update: {
          contact_id?: string
          content?: Json
          expires_at?: string
          generated_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_briefs_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_briefs_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts_with_status"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_interests: {
        Row: {
          contact_id: string
          created_at: string
          id: string
          tag: string
          user_id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          id?: string
          tag: string
          user_id: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          id?: string
          tag?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_interests_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_interests_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts_with_status"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          birthday: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          photo_url: string | null
          relationship_type: Database["public"]["Enums"]["relationship_type"]
          role: string | null
          target_frequency_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          birthday?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          relationship_type?: Database["public"]["Enums"]["relationship_type"]
          role?: string | null
          target_frequency_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          birthday?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          relationship_type?: Database["public"]["Enums"]["relationship_type"]
          role?: string | null
          target_frequency_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      interactions: {
        Row: {
          carnegie_principles: string[] | null
          contact_id: string
          created_at: string
          id: string
          note: string | null
          occurred_at: string
          type: Database["public"]["Enums"]["interaction_type"]
          user_id: string
        }
        Insert: {
          carnegie_principles?: string[] | null
          contact_id: string
          created_at?: string
          id?: string
          note?: string | null
          occurred_at?: string
          type: Database["public"]["Enums"]["interaction_type"]
          user_id: string
        }
        Update: {
          carnegie_principles?: string[] | null
          contact_id?: string
          created_at?: string
          id?: string
          note?: string | null
          occurred_at?: string
          type?: Database["public"]["Enums"]["interaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts_with_status"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      contacts_with_status: {
        Row: {
          birthday: string | null
          company: string | null
          created_at: string | null
          days_since_last_interaction: number | null
          email: string | null
          id: string | null
          is_due: boolean | null
          last_interaction_at: string | null
          name: string | null
          notes: string | null
          phone: string | null
          photo_url: string | null
          relationship_type:
            | Database["public"]["Enums"]["relationship_type"]
            | null
          role: string | null
          target_frequency_days: number | null
          total_interactions: number | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      interaction_type:
        | "call"
        | "message"
        | "whatsapp"
        | "email"
        | "meeting"
        | "coffee"
        | "event"
        | "other"
      relationship_type:
        | "family"
        | "friend"
        | "client"
        | "prospect"
        | "rotary"
        | "colleague"
        | "mentor"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      interaction_type: [
        "call",
        "message",
        "whatsapp",
        "email",
        "meeting",
        "coffee",
        "event",
        "other",
      ],
      relationship_type: [
        "family",
        "friend",
        "client",
        "prospect",
        "rotary",
        "colleague",
        "mentor",
        "other",
      ],
    },
  },
} as const

// ─── Kindred convenience types ────────────────────────────────────────────────

export type RelationshipType = Database["public"]["Enums"]["relationship_type"]
export type InteractionType = Database["public"]["Enums"]["interaction_type"]

export type Contact = Database["public"]["Tables"]["contacts"]["Row"]
export type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"]
export type ContactUpdate = Database["public"]["Tables"]["contacts"]["Update"]

export type Interaction = Database["public"]["Tables"]["interactions"]["Row"]
export type InteractionInsert = Database["public"]["Tables"]["interactions"]["Insert"]

export type ContactInterest = Database["public"]["Tables"]["contact_interests"]["Row"]

export type ContactBrief = Database["public"]["Tables"]["contact_briefs"]["Row"]
export type ContactBriefInsert = Database["public"]["Tables"]["contact_briefs"]["Insert"]

export type ContactWithStatus = Database["public"]["Views"]["contacts_with_status"]["Row"]

export type ContactBriefContent = {
  summary: string
  connection_points: string[]
  questions_to_ask: string[]
  carnegie_tips: string[]
  warning: string | null
}

export type ContactContext = {
  id: string;
  user_id: string;
  contact_id: string;
  key: string;
  value: string;
  source: "voice" | "manual";
  created_at: string;
};
