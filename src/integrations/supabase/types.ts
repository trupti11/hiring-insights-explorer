export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      candidates: {
        Row: {
          candidate_id: string
          experience_level: string | null
          job_position: string | null
          time_to_hire_days: number | null
          turnover_flag: boolean | null
        }
        Insert: {
          candidate_id: string
          experience_level?: string | null
          job_position?: string | null
          time_to_hire_days?: number | null
          turnover_flag?: boolean | null
        }
        Update: {
          candidate_id?: string
          experience_level?: string | null
          job_position?: string | null
          time_to_hire_days?: number | null
          turnover_flag?: boolean | null
        }
        Relationships: []
      }
      causal_edges: {
        Row: {
          cause_id: string | null
          confidence_score: number | null
          context: string | null
          effect_id: string | null
          evidence: string | null
          id: string
          relation: string
        }
        Insert: {
          cause_id?: string | null
          confidence_score?: number | null
          context?: string | null
          effect_id?: string | null
          evidence?: string | null
          id?: string
          relation?: string
        }
        Update: {
          cause_id?: string | null
          confidence_score?: number | null
          context?: string | null
          effect_id?: string | null
          evidence?: string | null
          id?: string
          relation?: string
        }
        Relationships: [
          {
            foreignKeyName: "causal_edges_cause_id_fkey"
            columns: ["cause_id"]
            isOneToOne: false
            referencedRelation: "causal_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "causal_edges_effect_id_fkey"
            columns: ["effect_id"]
            isOneToOne: false
            referencedRelation: "causal_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      causal_nodes: {
        Row: {
          description: string | null
          id: string
          name: string
          type: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          type?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          type?: string | null
        }
        Relationships: []
      }
      edges: {
        Row: {
          id: string
          relation: string | null
          source: string | null
          target: string | null
        }
        Insert: {
          id?: string
          relation?: string | null
          source?: string | null
          target?: string | null
        }
        Update: {
          id?: string
          relation?: string | null
          source?: string | null
          target?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "edges_source_fkey"
            columns: ["source"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "edges_target_fkey"
            columns: ["target"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      hiring_events: {
        Row: {
          candidate_id: string | null
          department: string | null
          event_id: string
          event_time: string | null
          event_type: string | null
          hire_status: string | null
          job_grade: string | null
        }
        Insert: {
          candidate_id?: string | null
          department?: string | null
          event_id: string
          event_time?: string | null
          event_type?: string | null
          hire_status?: string | null
          job_grade?: string | null
        }
        Update: {
          candidate_id?: string | null
          department?: string | null
          event_id?: string
          event_time?: string | null
          event_type?: string | null
          hire_status?: string | null
          job_grade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hiring_events_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["candidate_id"]
          },
        ]
      }
      nodes: {
        Row: {
          id: string
          label: string | null
          name: string | null
        }
        Insert: {
          id: string
          label?: string | null
          name?: string | null
        }
        Update: {
          id?: string
          label?: string | null
          name?: string | null
        }
        Relationships: []
      }
      responses: {
        Row: {
          candidate_id: string | null
          department: string | null
          id: string
          sentiment: string | null
          timestamp: string | null
          topic: string | null
        }
        Insert: {
          candidate_id?: string | null
          department?: string | null
          id: string
          sentiment?: string | null
          timestamp?: string | null
          topic?: string | null
        }
        Update: {
          candidate_id?: string | null
          department?: string | null
          id?: string
          sentiment?: string | null
          timestamp?: string | null
          topic?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responses_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["candidate_id"]
          },
        ]
      }
    }
    Views: {
      onboarding_survey_kg: {
        Row: {
          department_count: number | null
          negative_mentions: number | null
          topic: string | null
        }
        Relationships: []
      }
      slowest_hiring_cycles: {
        Row: {
          avg_time_to_hire_days: number | null
          department: string | null
          num_hires: number | null
        }
        Relationships: []
      }
      time_to_hire_turnover_corr_part_a: {
        Row: {
          candidate_id: string | null
          time_to_hire_days: number | null
          turnover_flag: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "hiring_events_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["candidate_id"]
          },
        ]
      }
      time_to_hire_turnover_corr_part_b: {
        Row: {
          correlation_coefficient: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
