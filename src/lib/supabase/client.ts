import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

// 타입 안전한 Supabase 클라이언트 타입
export type SafeSupabaseClient = SupabaseClient<Database>

// 브라우저 클라이언트 생성 - null 반환하지 않음
export const createClient = (): SafeSupabaseClient => {
  // 모의 데이터 모드에서는 에러 던지기
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Supabase client disabled - using mock mode')
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// 안전한 클라이언트 생성 (null 체크 포함)
export const createClientSafe = (): SafeSupabaseClient | null => {
  // 모의 데이터 모드에서는 null 반환
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Supabase client disabled - using mock mode')
    return null
  }

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// 싱글톤 인스턴스들
let browserClient: SafeSupabaseClient | undefined
let safeBrowserClient: SafeSupabaseClient | null | undefined

// 표준 클라이언트 (에러 던지기)
export const getSupabaseClient = (): SafeSupabaseClient => {
  if (!browserClient) {
    browserClient = createClient()
  }
  return browserClient
}

// 안전한 클라이언트 (null 허용)
export const getSupabaseClientSafe = (): SafeSupabaseClient | null => {
  if (safeBrowserClient === undefined) {
    safeBrowserClient = createClientSafe()
  }
  return safeBrowserClient
}