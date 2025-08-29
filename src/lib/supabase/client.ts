import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

// 브라우저 클라이언트 생성
export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// 싱글톤 인스턴스 (선택적)
let browserClient: ReturnType<typeof createClient> | undefined

export const getSupabaseClient = () => {
  if (!browserClient) {
    browserClient = createClient()
  }
  return browserClient
}