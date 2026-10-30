export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'worker' | 'citizen' | 'authority';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type ComplaintCategory =
  | 'overflowing-bin'
  | 'garbage-dump'
  | 'blocked-drain'
  | 'missed-pickup'
  | 'other';
export type ComplaintStatus = 'pending' | 'assigned' | 'in-progress' | 'resolved';
export type AuditStatus = 'approved' | 'under-review' | 'flagged';
export type TrainingCategory = 'Safety' | 'Efficiency' | 'Emergency' | 'General';
export type PublicationStatus = 'published' | 'draft' | 'archived';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string; // references auth.users.id
          full_name: string;
          email: string | null;
          role: UserRole;
          worker_id: string | null;
          citizen_id: string | null;
          authority_id: string | null;
          mobile: string | null;
          zone: string;
          team: string | null;
          department: string | null;
          designation: string | null;
          join_date: string;
          last_checkup: string | null;
          health_status: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email?: string | null;
          role?: UserRole;
          worker_id?: string | null;
          citizen_id?: string | null;
          authority_id?: string | null;
          mobile?: string | null;
          zone?: string;
          team?: string | null;
          department?: string | null;
          designation?: string | null;
          join_date?: string;
          last_checkup?: string | null;
          health_status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string | null;
          role?: UserRole;
          worker_id?: string | null;
          citizen_id?: string | null;
          authority_id?: string | null;
          mobile?: string | null;
          zone?: string;
          team?: string | null;
          department?: string | null;
          designation?: string | null;
          join_date?: string;
          last_checkup?: string | null;
          health_status?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      waste_collection_tasks: {
        Row: {
          id: string;
          route_name: string;
          location: string;
          zone: string;
          lat: number;
          lng: number;
          waste_category: string[];
          scheduled_date: string;
          assigned_worker_id: string | null;
          status: TaskStatus;
          weight_kg: number;
          proof_before_url: string | null;
          proof_after_url: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          route_name: string;
          location: string;
          zone?: string;
          lat: number;
          lng: number;
          waste_category?: string[];
          scheduled_date?: string;
          assigned_worker_id?: string | null;
          status?: TaskStatus;
          weight_kg?: number;
          proof_before_url?: string | null;
          proof_after_url?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          route_name?: string;
          location?: string;
          zone?: string;
          lat?: number;
          lng?: number;
          waste_category?: string[];
          scheduled_date?: string;
          assigned_worker_id?: string | null;
          status?: TaskStatus;
          weight_kg?: number;
          proof_before_url?: string | null;
          proof_after_url?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      citizen_complaints: {
        Row: {
          id: string;
          citizen_id: string | null;
          citizen_name: string;
          citizen_mobile: string | null;
          category: ComplaintCategory;
          description: string;
          location: string;
          zone: string;
          lat: number | null;
          lng: number | null;
          image_url: string | null;
          status: ComplaintStatus;
          assigned_worker_id: string | null;
          resolved_image_url: string | null;
          resolution_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          citizen_id?: string | null;
          citizen_name: string;
          citizen_mobile?: string | null;
          category: ComplaintCategory;
          description: string;
          location: string;
          zone?: string;
          lat?: number | null;
          lng?: number | null;
          image_url?: string | null;
          status?: ComplaintStatus;
          assigned_worker_id?: string | null;
          resolved_image_url?: string | null;
          resolution_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          citizen_id?: string | null;
          citizen_name?: string;
          citizen_mobile?: string | null;
          category?: ComplaintCategory;
          description?: string;
          location?: string;
          zone?: string;
          lat?: number | null;
          lng?: number | null;
          image_url?: string | null;
          status?: ComplaintStatus;
          assigned_worker_id?: string | null;
          resolved_image_url?: string | null;
          resolution_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      collection_records: {
        Row: {
          id: string;
          task_id: string | null;
          worker_id: string;
          collection_date: string;
          waste_category: string;
          quantity_kg: number;
          proof_before_url: string | null;
          proof_after_url: string | null;
          completion_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id?: string | null;
          worker_id: string;
          collection_date?: string;
          waste_category: string;
          quantity_kg?: number;
          proof_before_url?: string | null;
          proof_after_url?: string | null;
          completion_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string | null;
          worker_id?: string;
          collection_date?: string;
          waste_category?: string;
          quantity_kg?: number;
          proof_before_url?: string | null;
          proof_after_url?: string | null;
          completion_notes?: string | null;
          created_at?: string;
        };
      };
      training_resources: {
        Row: {
          id: string;
          title: string;
          description: string;
          content_url: string;
          duration: string | null;
          thumbnail_url: string | null;
          category: TrainingCategory;
          publication_status: PublicationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          content_url: string;
          duration?: string | null;
          thumbnail_url?: string | null;
          category?: TrainingCategory;
          publication_status?: PublicationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          content_url?: string;
          duration?: string | null;
          thumbnail_url?: string | null;
          category?: TrainingCategory;
          publication_status?: PublicationStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      area_cleanliness: {
        Row: {
          id: string;
          name: string;
          zone: string;
          ward: string;
          cleanliness_score: number;
          status: string;
          last_cleaned_time: string;
          assigned_worker_id: string | null;
          lat: number;
          lng: number;
          proof_before_url: string | null;
          proof_after_url: string | null;
          verified_by_citizen_count: number;
          total_reports: number;
          next_scheduled_collection: string | null;
          waste_types_collected: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          zone: string;
          ward: string;
          cleanliness_score?: number;
          status?: string;
          last_cleaned_time?: string;
          assigned_worker_id?: string | null;
          lat: number;
          lng: number;
          proof_before_url?: string | null;
          proof_after_url?: string | null;
          verified_by_citizen_count?: number;
          total_reports?: number;
          next_scheduled_collection?: string | null;
          waste_types_collected?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          zone?: string;
          ward?: string;
          cleanliness_score?: number;
          status?: string;
          last_cleaned_time?: string;
          assigned_worker_id?: string | null;
          lat?: number;
          lng?: number;
          proof_before_url?: string | null;
          proof_after_url?: string | null;
          verified_by_citizen_count?: number;
          total_reports?: number;
          next_scheduled_collection?: string | null;
          waste_types_collected?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      worker_audits: {
        Row: {
          id: string;
          worker_id: string;
          audit_date: string;
          zone: string;
          tasks_assigned: number;
          tasks_completed: number;
          total_weight_kg: number;
          photo_compliance_score: number;
          audit_status: AuditStatus;
          calculated_incentive: number;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          worker_id: string;
          audit_date?: string;
          zone: string;
          tasks_assigned?: number;
          tasks_completed?: number;
          total_weight_kg?: number;
          photo_compliance_score?: number;
          audit_status?: AuditStatus;
          calculated_incentive?: number;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          worker_id?: string;
          audit_date?: string;
          zone?: string;
          tasks_assigned?: number;
          tasks_completed?: number;
          total_weight_kg?: number;
          photo_compliance_score?: number;
          audit_status?: AuditStatus;
          calculated_incentive?: number;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      current_user_role: {
        Args: Record<PropertyKey, never>;
        Returns: UserRole;
      };
      is_authority: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_worker: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_citizen: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      vote_area_cleanliness: {
        Args: {
          p_area_id: string;
          p_is_clean: boolean;
        };
        Returns: void;
      };
    };
    Enums: {
      user_role: UserRole;
      task_status: TaskStatus;
      complaint_category: ComplaintCategory;
      complaint_status: ComplaintStatus;
      audit_status: AuditStatus;
      training_category: TrainingCategory;
      publication_status: PublicationStatus;
    };
  };
}
