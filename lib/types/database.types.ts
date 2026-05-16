// Handwritten stub — regenerate with:
// supabase gen types typescript --linked > lib/types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string | null; created_at: string };
        Insert: { id: string; email?: string | null; created_at?: string };
        Update: { id?: string; email?: string | null; created_at?: string };
        Relationships: [];
      };
      boards: {
        Row: { id: string; user_id: string; name: string; created_at: string };
        Insert: { id?: string; user_id: string; name: string; created_at?: string };
        Update: { id?: string; user_id?: string; name?: string; created_at?: string };
        Relationships: [
          { foreignKeyName: "boards_user_id_fkey"; columns: ["user_id"]; referencedRelation: "profiles"; referencedColumns: ["id"] }
        ];
      };
      columns: {
        Row: { id: string; board_id: string; name: string; position: number; created_at: string };
        Insert: { id?: string; board_id: string; name: string; position: number; created_at?: string };
        Update: { id?: string; board_id?: string; name?: string; position?: number; created_at?: string };
        Relationships: [
          { foreignKeyName: "columns_board_id_fkey"; columns: ["board_id"]; referencedRelation: "boards"; referencedColumns: ["id"] }
        ];
      };
      tasks: {
        Row: {
          id: string;
          column_id: string;
          name: string;
          description: string | null;
          priority: "low" | "medium" | "high" | null;
          due_date: string | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          column_id: string;
          name: string;
          description?: string | null;
          priority?: "low" | "medium" | "high" | null;
          due_date?: string | null;
          position: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          column_id?: string;
          name?: string;
          description?: string | null;
          priority?: "low" | "medium" | "high" | null;
          due_date?: string | null;
          position?: number;
          created_at?: string;
        };
        Relationships: [
          { foreignKeyName: "tasks_column_id_fkey"; columns: ["column_id"]; referencedRelation: "columns"; referencedColumns: ["id"] }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Board = Database["public"]["Tables"]["boards"]["Row"];
export type Column = Database["public"]["Tables"]["columns"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
