'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Session } from '@supabase/supabase-js'
import useSWR from 'swr'

import { Profile } from '@/types/collections'
import { useSupabase } from '@/components/providers/supabase-provider'

type SignInReturnType = { error: { message: string } } | { error: null }

interface ContextI {
  user: Profile | null | undefined
  error: any
  isLoading: boolean
  isAuthenticating: boolean
  signOut: () => Promise<void>
  signInWithGithub: () => Promise<SignInReturnType>
  signInWithOtp: (email: string) => Promise<SignInReturnType>
}
const Context = createContext<ContextI>({
  user: null,
  error: false,
  isLoading: true,
  isAuthenticating: false,
  signOut: async () => undefined,
  signInWithGithub: async () => ({ error: null }),
  signInWithOtp: async () => ({ error: null }),
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

  // Get USER
  const getUser = async (): Promise<Profile | null> => {
    if (!serverSession) return null

    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', serverSession.user.id)
      .single()

    if (error) {
      console.log({ error })
      return null
    }

    return user
  }

  const {
    data: user,
    error,
    isLoading,
  } = useSWR(serverSession ? 'profile-context' : null, getUser)

  // Sign-In with Github
  const signInWithGithub = async () => {
    let result: SignInReturnType = { error: null }
    setIsAuthenticating(true)

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/api/auth/callback`,
      },
    })

    if (signInError) {
      result = { error: { message: signInError.message } }
    }

    return result
  }

  // Sign-In with Magic Link
  const signInWithOtp = async (email: string) => {
    let result: SignInReturnType = { error: null }
    setIsAuthenticating(true)

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    })

    if (signInError) {
      result = { error: { message: signInError.message } }
    }

    return result
  }

  // Sign Out
  const signOut = async () => {
    setIsAuthenticating(true)
    await supabase.auth.signOut()
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
