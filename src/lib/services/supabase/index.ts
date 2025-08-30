// Supabase 서비스 통합 인덱스

export { clientService } from './clients.service'
export { projectsService } from './projects.service'
export { invoicesService } from './invoices.service'
export { documentsService } from './documents.service'
export { chatService } from './chat.service'
export { taxService } from './tax.service'
export { remindersService } from './reminders.service'

// 타입 재내보내기
export type { Database } from '@/lib/supabase/database.types'

// 클라이언트 재내보내기
export { createClient, getSupabaseClient } from '@/lib/supabase/client'
export { createClient as createServerClient, createRouteHandlerClient, createServiceRoleClient } from '@/lib/supabase/server'