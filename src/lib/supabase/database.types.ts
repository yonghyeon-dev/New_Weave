export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // 클라이언트 테이블
      clients: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          company: string
          business_number: string | null
          email: string
          phone: string | null
          address: string | null
          contact_person: string | null
          status: 'active' | 'inactive'
          tax_type: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          company: string
          business_number?: string | null
          email: string
          phone?: string | null
          address?: string | null
          contact_person?: string | null
          status?: 'active' | 'inactive'
          tax_type?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          company?: string
          business_number?: string | null
          email?: string
          phone?: string | null
          address?: string | null
          contact_person?: string | null
          status?: 'active' | 'inactive'
          tax_type?: string | null
          metadata?: Json | null
        }
      }

      // 프로젝트 테이블
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          client_id: string | null
          name: string
          description: string | null
          status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          start_date: string | null
          due_date: string | null
          budget_estimated: number | null
          budget_spent: number | null
          progress: number
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          client_id?: string | null
          name: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          start_date?: string | null
          due_date?: string | null
          budget_estimated?: number | null
          budget_spent?: number | null
          progress?: number
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          client_id?: string | null
          name?: string
          description?: string | null
          status?: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          start_date?: string | null
          due_date?: string | null
          budget_estimated?: number | null
          budget_spent?: number | null
          progress?: number
          metadata?: Json | null
        }
      }

      // 인보이스 테이블
      invoices: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          project_id: string | null
          client_id: string
          invoice_number: string
          status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          issue_date: string
          due_date: string
          subtotal: number
          tax: number
          total: number
          currency: string
          items: Json
          notes: string | null
          paid_date: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          project_id?: string | null
          client_id: string
          invoice_number: string
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          issue_date: string
          due_date: string
          subtotal: number
          tax: number
          total: number
          currency?: string
          items: Json
          notes?: string | null
          paid_date?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          project_id?: string | null
          client_id?: string
          invoice_number?: string
          status?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
          issue_date?: string
          due_date?: string
          subtotal?: number
          tax?: number
          total?: number
          currency?: string
          items?: Json
          notes?: string | null
          paid_date?: string | null
          metadata?: Json | null
        }
      }

      // 문서 테이블 (RAG용)
      documents: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          project_id: string | null
          name: string
          type: string
          content: string | null
          file_url: string | null
          file_size: number | null
          mime_type: string | null
          embeddings: number[] | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          project_id?: string | null
          name: string
          type: string
          content?: string | null
          file_url?: string | null
          file_size?: number | null
          mime_type?: string | null
          embeddings?: number[] | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          project_id?: string | null
          name?: string
          type?: string
          content?: string | null
          file_url?: string | null
          file_size?: number | null
          mime_type?: string | null
          embeddings?: number[] | null
          metadata?: Json | null
        }
      }

      // 채팅 세션 테이블
      chat_sessions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string | null
          type: 'general' | 'tax' | 'rag'
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title?: string | null
          type?: 'general' | 'tax' | 'rag'
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string | null
          type?: 'general' | 'tax' | 'rag'
          metadata?: Json | null
        }
      }

      // 채팅 메시지 테이블
      chat_messages: {
        Row: {
          id: string
          created_at: string
          session_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          session_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          session_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          metadata?: Json | null
        }
      }

      // 세무 정보 테이블
      tax_records: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          client_id: string | null
          business_number: string
          tax_type: string
          status: string
          year: number
          quarter: number | null
          amount: number
          filed_date: string | null
          due_date: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          client_id?: string | null
          business_number: string
          tax_type: string
          status: string
          year: number
          quarter?: number | null
          amount: number
          filed_date?: string | null
          due_date?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          client_id?: string | null
          business_number?: string
          tax_type?: string
          status?: string
          year?: number
          quarter?: number | null
          amount?: number
          filed_date?: string | null
          due_date?: string | null
          metadata?: Json | null
        }
      }

      // 리마인더 테이블
      reminders: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          project_id: string | null
          title: string
          description: string | null
          due_date: string
          priority: 'low' | 'medium' | 'high'
          status: 'pending' | 'completed' | 'cancelled'
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          project_id?: string | null
          title: string
          description?: string | null
          due_date: string
          priority?: 'low' | 'medium' | 'high'
          status?: 'pending' | 'completed' | 'cancelled'
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          project_id?: string | null
          title?: string
          description?: string | null
          due_date?: string
          priority?: 'low' | 'medium' | 'high'
          status?: 'pending' | 'completed' | 'cancelled'
          metadata?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      // 벡터 검색 함수 (RAG용)
      search_documents: {
        Args: {
          query_embedding: number[]
          match_threshold?: number
          match_count?: number
        }
        Returns: {
          id: string
          name: string
          content: string
          similarity: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}