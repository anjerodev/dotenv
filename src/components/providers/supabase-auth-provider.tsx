'use client'

import { createContext, useContext, useEffect, useState } from 'react'
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
  isAuthenticating: boolean
  signOut: () => Promise<void>
  signInWithGithub: () => Promise<string | undefined>
  signInWithOtp: (email: string) => Promise<string | undefined>
}
const Context = createContext<ContextI>({
  user: null,
  error: false,
  isLoading: true,
  isAuthenticating: false,
  signOut: async () => {},
  signInWithGithub: async () => undefined,
  signInWithOtp: async () => undefined,
})

export const SupabaseAuthProvider = ({
  serverSession,
  children,
}: {
  serverSession?: Session | null
  children: React.ReactNode
}) => {
  const { supabase } = useSupabase()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

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

  // Sign-In with Github
  const signInWithGithub = async () => {
    setIsAuthenticating(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback?from=${
          searchParams?.get('from') || routes.PROJECTS
        }`,
      },
    })

    if (error) {
      return error.message
    }
  }

  // Sign-In with Magic Link
  const signInWithOtp = async (email: string) => {
    setIsAuthenticating(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback?from=${
          searchParams?.get('from') || routes.PROJECTS
        }`,
      },
    })

    if (error) {
      return error.message
    }
  }

  // Sign Out
  const signOut = async () => {
    setIsAuthenticating(true)
    await supabase.auth.signOut()
    router.refresh()
  }

  // Refresh the Page to Sync Server and Client
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverSession?.access_token) {
        router.refresh()
      }
      setIsAuthenticating(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase, serverSession?.access_token])

  const exposed: ContextI = {
    user,
    error,
    isLoading,
    isAuthenticating,
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
