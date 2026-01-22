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
            businesses: {
                Row: {
                    id: string
                    user_id: string | null
                    name: string
                    phone_number: string | null
                    timezone: string | null
                    created_at: string
                    region: string | null
                    country_code: string | null
                    currency: string | null
                    locale: string | null
                    date_format: string | null
                    default_phone_number: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    name: string
                    phone_number?: string | null
                    timezone?: string | null
                    created_at?: string
                    region?: string | null
                    country_code?: string | null
                    currency?: string | null
                    locale?: string | null
                    date_format?: string | null
                    default_phone_number?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    name?: string
                    phone_number?: string | null
                    timezone?: string | null
                    created_at?: string
                    region?: string | null
                    country_code?: string | null
                    currency?: string | null
                    locale?: string | null
                    date_format?: string | null
                    default_phone_number?: string | null
                }
            }
            knowledge_chunks: {
                Row: {
                    id: string
                    business_id: string
                    content: string
                    embedding: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    business_id: string
                    content: string
                    embedding?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    business_id?: string
                    content?: string
                    embedding?: string | null
                    created_at?: string
                }
            }
            business_configs: {
                Row: {
                    business_id: string
                    working_hours: Json | null
                    min_notice_hours: number | null
                    updated_at: string | null
                }
                Insert: {
                    business_id: string
                    working_hours?: Json | null
                    min_notice_hours?: number | null
                    updated_at?: string | null
                }
                Update: {
                    business_id?: string
                    working_hours?: Json | null
                    min_notice_hours?: number | null
                    updated_at?: string | null
                }
            }
        }
    }
}
