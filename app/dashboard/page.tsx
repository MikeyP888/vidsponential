import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from '../components/SignOutButton'
import VideoCard from '../components/VideoCard'

interface TrendingVideo {
  video_id: string
  title: string
  channel_name: string
  thumbnail_url: string
  trending_score: number
  view_count: number
  days_since_published: number
}

export default async function Dashboard() {
  let user = null
  let videos = null
  let error = null

  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user

    if (!user) {
      redirect('/')
    }

    // Fetch trending videos from the view
    const result = await supabase
      .from('youtube_client_trending_dashboard')
      .select('*')
      .order('trending_score', { ascending: false })
      .limit(50)

    videos = result.data
    error = result.error

    if (error) {
      console.error('Error fetching trending videos:', error)
    }
  } catch (err) {
    console.error('Dashboard error:', err)
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
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
            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold gradient-text">
            Trending Videos
          </h2>
          <p className="text-gray-600 mt-1">
            {videos?.length || 0} videos trending now
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            Error loading videos. Please try again later.
          </div>
        )}

        {videos && videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video: TrendingVideo) => (
              <VideoCard key={video.video_id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No trending videos found.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
