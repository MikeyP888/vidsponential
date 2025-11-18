interface TrendingVideo {
  video_id: string
  title: string
  channel_name: string
  thumbnail_url: string
  trending_score: number
  view_count: number
  days_since_published: number
}

interface VideoCardProps {
  video: TrendingVideo
}

export default function VideoCard({ video }: VideoCardProps) {
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <a
        href={`https://www.youtube.com/watch?v=${video.video_id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-200">
          {video.thumbnail_url ? (
            <img
              src={video.thumbnail_url}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No thumbnail
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 hover:text-purple-600 transition-colors">
            {video.title}
          </h3>

          {/* Channel Name */}
          <p className="text-sm text-gray-600 mb-3">
            {video.channel_name}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-gray-500">Views: </span>
                <span className="font-medium text-gray-700">
                  {formatViews(video.view_count)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Score: </span>
                <span className="font-medium gradient-text">
                  {video.trending_score.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Days Since Published */}
          <div className="mt-2 text-xs text-gray-500">
            {video.days_since_published === 0
              ? 'Published today'
              : `${Math.round(video.days_since_published)} day${
                  Math.round(video.days_since_published) !== 1 ? 's' : ''
                } ago`}
          </div>
        </div>
      </a>
    </div>
  )
}
