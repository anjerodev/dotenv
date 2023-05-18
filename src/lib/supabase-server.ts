import { cookies, headers } from 'next/headers'
import {
  Session,
  createServerComponentSupabaseClient,
} from '@supabase/auth-helpers-nextjs'

import 'server-only'
import { redirect } from 'next/navigation'
import { routes } from '@/constants/routes'

import type { Database } from '@/types/supabase'

import { RequestError } from './request-error-handler'

type SupabaseError = {
  message: string
  status: number
}

type SupabaseClientInfo = {
  supabase: ReturnType<
    typeof createServerComponentSupabaseClient<Database>
  > | null
  session: Session | null
  error: SupabaseError | null
}

export const createServerClient = () => {
  return createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  })
}

export async function getSupabaseServerClientInfo(): Promise<SupabaseClientInfo> {
  try {
    const supabase = createServerClient()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      throw new RequestError({ message: 'Unauthorized', status: 401 })
    }

    return { supabase, session, error: null }
  } catch (error: any) {
    return {
      supabase: null,
      session: null,
      error: { message: error.message, status: error.status },
    }
  }
}

export async function checkUsername() {
  const { supabase, session } = await getSupabaseServerClientInfo()

  if (session && supabase) {
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
