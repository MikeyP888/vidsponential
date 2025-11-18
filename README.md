# Vidsponential - YouTube Trending Dashboard

A Next.js application that displays trending YouTube videos using data from Supabase and Google OAuth authentication.

## Features

- **Google OAuth Authentication** - Secure login with Google
- **Trending Videos Dashboard** - View top trending YouTube videos
- **Real-time Data** - Powered by Supabase
- **Modern UI** - Clean design with purple/pink gradient theme
- **Responsive** - Works on all devices

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: Supabase Auth with Google OAuth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase project set up with:
  - Google OAuth configured
  - View: `youtube_client_trending_dashboard`

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vidsponential.git
cd vidsponential
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables in Vercel project settings
4. Deploy!

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `NEXT_PUBLIC_SITE_URL` | Your production URL (e.g., https://vidsponential.com) |

## Database Schema

The app expects a Supabase view named `youtube_client_trending_dashboard` with the following fields:

- `video_id` (string)
- `title` (string)
- `channel_name` (string)
- `thumbnail_url` (string)
- `trending_score` (number)
- `view_count` (number)
- `days_since_published` (number)

## License

MIT
