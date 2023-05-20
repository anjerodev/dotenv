import { cookies, headers } from 'next/headers'
// import 'server-only'
import { redirect } from 'next/navigation'
import { routes } from '@/constants/routes'
import {
  Session,
  createServerComponentSupabaseClient,
} from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

import type { Database } from '@/types/supabase'

import { RequestError } from './request-error-handler'

type SupabaseError = {
  message: string
  status: number
}

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const createServerClient = () => {
  return createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  })
}

type SupabaseClientInfo = {
  supabase: ReturnType<
    typeof createServerComponentSupabaseClient<Database>
  > | null
  session: Session
  error: SupabaseError | null
}

export async function getSession(): Promise<SupabaseClientInfo> {
  const supabase = createServerClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw new RequestError({ message: 'Unauthorized', status: 401 })
    }

    return { supabase, session, error: null }
  } catch (error: any) {
    const errorResponse = {
      message: error.message,
      status: error.status,
    }

    return { supabase, session: undefined as any, error: errorResponse }
  }
}

export async function checkUsername() {
  const { session } = await getSession()

  if (session) {
    const userId = session.user.id
    const { data: user, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single()

    // console.log({ username: user?.username })
    if (!user?.username) redirect(routes.ACCOUNT)

    //  TODO: handle if error
  }
}
