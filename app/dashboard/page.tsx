'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'
import Image from 'next/image'

interface TrendingVideo {
  video_id: string
  video_title: string
  channel_name: string
  thumbnail_url: string
  trending_score: number
  view_count: number
  days_since_published: number
  youtube_url: string
}

export default function Dashboard() {
  const [videos, setVideos] = useState<TrendingVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/')
      } else {
        setUser(session.user)
      }
    })

    // Fetch trending videos
    fetchTrendingVideos()
  }, [router, supabase.auth])

  const fetchTrendingVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('youtube_client_trending_dashboard')
        .select('*')
        .order('trending_score', { ascending: false })

      if (error) throw error

      setVideos(data || [])
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl gradient-text">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Trending Videos Dashboard
            </h1>
            {user && (
              <p className="text-white/70">Welcome, {user.email}</p>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-lg px-6 py-2 rounded-lg transition-all duration-200 border border-white/20"
          >
            Sign Out
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-white/70 text-sm mb-1">Total Videos</h3>
            <p className="text-3xl font-bold">{videos.length}</p>
          </div>
          <div className="card">
            <h3 className="text-white/70 text-sm mb-1">Total Views</h3>
            <p className="text-3xl font-bold">
              {formatNumber(videos.reduce((sum, v) => sum + (v.view_count || 0), 0))}
            </p>
          </div>
          <div className="card">
            <h3 className="text-white/70 text-sm mb-1">Avg Trending Score</h3>
            <p className="text-3xl font-bold">
              {videos.length > 0
                ? (videos.reduce((sum, v) => sum + (v.trending_score || 0), 0) / videos.length).toFixed(1)
                : 0}
            </p>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <a
              key={video.video_id}
              href={video.youtube_url || `https://youtube.com/watch?v=${video.video_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card hover:scale-105 transition-transform duration-200 cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden bg-white/5">
                {video.thumbnail_url ? (
                  <Image
                    src={video.thumbnail_url}
                    alt={video.video_title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50">
                    No Thumbnail
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Video Info */}
              <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-teal-300 transition-colors">
                {video.video_title}
              </h3>

              <p className="text-sm text-white/70 mb-3">
                {video.channel_name}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-white/5 rounded px-2 py-1">
                  <span className="text-white/60">Score: </span>
                  <span className="font-semibold text-teal-300">
                    {video.trending_score?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <div className="bg-white/5 rounded px-2 py-1">
                  <span className="text-white/60">Views: </span>
                  <span className="font-semibold">
                    {formatNumber(video.view_count || 0)}
                  </span>
                </div>
                <div className="bg-white/5 rounded px-2 py-1 col-span-2">
                  <span className="text-white/60">Published: </span>
                  <span className="font-semibold">
                    {video.days_since_published} days ago
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {videos.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-xl text-white/70">
              No trending videos found. Check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
