import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import GoogleSignIn from './components/GoogleSignIn'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Vidsponential
          </h1>
          <p className="text-gray-600 mb-8">
            YouTube Trending Dashboard
          </p>
          <GoogleSignIn />
        </div>
      </div>
    </main>
  )
}
