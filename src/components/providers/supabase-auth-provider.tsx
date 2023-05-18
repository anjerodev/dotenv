'use client'

import { createContext, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { routes } from '@/constants/routes'
import { Session } from '@supabase/supabase-js'
import useSWR from 'swr'

import { Profile } from '@/types/collections'
import { downloadImage } from '@/lib/download-image'

import { useSupabase } from './supabase-provider'

interface ContextI {
  user: Profile | null | undefined
  error: any
  isLoading: boolean
  mutate: any
  signOut: () => Promise<void>
  signInWithGithub: () => Promise<string | null>
  signInWithOtp: (email: string) => Promise<string | null>
  updateCache: (data?: Partial<Profile>) => void
}
const Context = createContext<ContextI>({
  user: null,
  error: null,
  isLoading: true,
  mutate: null,
  signOut: async () => {},
  signInWithGithub: async () => null,
  signInWithOtp: async (email: string) => null,
  updateCache: () => {},
})

export default function SupabaseAuthProvider({
  serverSession,
  children,
}: {
  serverSession?: Session | null
  children: React.ReactNode
}) {
  const { supabase } = useSupabase()
  const router = useRouter()

  // Get USER
  const getUser = async (): Promise<Profile | null> => {
    const authUser = await supabase.auth.getUser()
    const email = authUser.data.user?.email

    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', serverSession?.user?.id)
      .single()

    const avatar = await downloadImage({ supabase, path: user?.avatar_url })

    if (error) {
      console.log(error)
      return null
    } else {
      return { email, avatar, ...user }
    }
  }

  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR(serverSession ? 'profile-context' : null, getUser)

  // Sign Out
  const signOut = async () => {
    await supabase.auth.signOut()
    router.push(routes.LOGIN)
  }

  const redirectUrl = 'http://localhost:3000/projects' // TODO: Change for the real url

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

  const updateCache = (data?: Partial<Profile>) => {
    if (!data) return
    const newData = Object.assign({}, user, data)
    mutate(newData)
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
    mutate,
    signOut,
    signInWithGithub,
    signInWithOtp,
    updateCache,
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
