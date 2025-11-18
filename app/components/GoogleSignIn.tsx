'use client'

import { signInWithGoogle } from '../actions/auth'

export default function GoogleSignIn() {
  return (
    <form action={signInWithGoogle}>
      <button
        type="submit"
        className="w-full gradient-bg text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-lg"
      >
        Login with Google
      </button>
    </form>
  )
}
