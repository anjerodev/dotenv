import { Database } from './supabase'

export enum MemberRole {
  Owner = 'owner',
  Editor = 'editor',
  Viewer = 'viewer',
}

export enum membersActions {
  CREATE = 'create',
  UPDATE = 'update',
  REMOVE = 'remove',
}

export interface Member {
  ref?: string
  id: string
  username: string | null
  avatar_url: string | null
  email?: string
  role: MemberRole
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInputType =
  Database['public']['Tables']['profiles']['Insert']

export type DocumentsHistory =
  Database['public']['Tables']['documents_history']['Row']

export type DocumentMembers =
  Database['public']['Tables']['documents_members']['Row']

export type DocumentType = Database['public']['Tables']['documents']['Row']

export type TeamType = {
  members: Member[]
  count: number
}

export interface Document
  extends DocumentType,
    Omit<DocumentsHistory, 'id' | 'document_id' | 'updated_by'> {
  team: TeamType
  updated_by: Partial<Member>
}
export type DocumentInputType =
  Database['public']['Tables']['documents']['Insert']

export type ProjectType = Database['public']['Tables']['projects']['Row']
export type ProjectInputType =
  Database['public']['Tables']['projects']['Insert']

export interface Project extends ProjectType {
  documents: Document[]
  team: TeamType
}
