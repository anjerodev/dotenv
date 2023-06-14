'use client'

import { createContext, useContext, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { routes } from '@/constants/routes'
import { Session } from '@supabase/supabase-js'
import useSWR from 'swr'

import { Profile } from '@/types/collections'

import { useSupabase } from './supabase-provider'

interface ContextI {
  user: Profile | null | undefined
  error: any
  isLoading: boolean
  signOut: () => Promise<void>
  signInWithGithub: () => Promise<string | null>
  signInWithOtp: (email: string) => Promise<string | null>
}
const Context = createContext<ContextI>({
  user: null,
  error: false,
  isLoading: true,
  signOut: async () => {},
  signInWithGithub: async () => null,
  signInWithOtp: async (email: string) => null,
})

export const SupabaseAuthProvider = ({
  serverSession,
  children,
}: {
  serverSession?: Session | null
  children: React.ReactNode
}) => {
  const { supabase } = useSupabase()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get USER
  const getUser = async (): Promise<Profile | null> => {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', serverSession?.user?.id)
      .single()

    const avatar = user?.avatar_url
      ? supabase.storage.from('avatars').getPublicUrl(user?.avatar_url).data
          .publicUrl
      : null

    if (error) {
      console.log(error)
      return null
    } else {
      return { avatar, ...user }
    }
  }

  const {
    data: user,
    error,
    isLoading,
  } = useSWR(serverSession ? 'profile-context' : null, getUser)

  // Sign Out
  const signOut = async () => {
    await supabase.auth.signOut()
    router.push(routes.LOGIN)
  }

  const base = 'http://localhost:3000' // TODO: Change for the real url
  const redirectUrl = base + (searchParams?.get('from') || routes.PROJECTS)

  const options = {
    redirectTo: redirectUrl,
  }

  // Sign-In with Github
  const signInWithGithub = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options,
    })

    if (error) {
      return error.message
    }

    return null
  }

  // Sign-In with Magic Link
  const signInWithOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    })

    if (error) {
      return error.message
    }

    return null
  }

  // Refresh the Page to Sync Server and Client
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverSession?.access_token) {
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase, serverSession?.access_token])

  const exposed: ContextI = {
    user,
    error,
    isLoading,
    signOut,
    signInWithGithub,
    signInWithOtp,
  }

  return <Context.Provider value={exposed}>{children}</Context.Provider>
}

export const useAuth = () => {
  let context = useContext(Context)
  if (context === undefined) {
    throw new Error('useAuth must be used inside SupabaseAuthProvider')
  } else {
    return context
  }
}
