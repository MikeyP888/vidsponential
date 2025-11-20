export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="gradient-bg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Vidsponential
              </h1>
              <p className="text-purple-100 mt-1">
                YouTube Trending Dashboard
              </p>
            </div>
            <a
              href="/"
              className="bg-white text-purple-600 font-semibold py-2 px-6 rounded-lg hover:bg-purple-50 transition-colors shadow-md"
            >
              Sign Out
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold gradient-text">
            Trending Videos
          </h2>
          <p className="text-gray-600 mt-1">
            Dashboard is working! Configure authentication to see videos.
          </p>
        </div>
      </main>
    </div>
  )
}
