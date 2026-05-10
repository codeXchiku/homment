import { useUserSync } from '@/hooks/useUserSync'
import { useAuth } from '@clerk/expo'
import { Redirect, Slot } from 'expo-router'

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth()


  //sync clerk user -> supabase
  useUserSync();

  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return <Redirect href="/signIn" />
  }

  return <Slot/>
}