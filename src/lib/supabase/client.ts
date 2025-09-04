import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

// 브라우저 클라이언트 생성
export const createClient = () => {
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

// 싱글톤 인스턴스 (선택적)
let browserClient: ReturnType<typeof createClient> | undefined

export const getSupabaseClient = () => {
  // 모의 데이터 모드에서는 null 반환
  if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return null
  }

  if (!browserClient) {
    browserClient = createClient()
  }
  return browserClient
}