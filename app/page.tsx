export default function Home() {
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
          <a
            href="/api/auth/google"
            className="block w-full gradient-bg text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity shadow-lg text-center"
          >
            Login with Google
          </a>
        </div>
      </div>
    </main>
  )
}
