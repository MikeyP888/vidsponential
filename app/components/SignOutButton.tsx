'use client'

import { signOut } from '../actions/auth'

export default function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="bg-white text-purple-600 font-semibold py-2 px-6 rounded-lg hover:bg-purple-50 transition-colors shadow-md"
      >
        Sign Out
      </button>
    </form>
  )
}
