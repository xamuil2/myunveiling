# myunveiling

A professional music streaming website for the album "myunveiling" built with Next.js 15, React 19, and shadcn/ui.

## Features

- 🎵 Professional Spotify-like interface
- 🎛️ Full-featured music player with play/pause, seeking, and volume control
- 📱 Responsive design that works on all devices
- 🎨 Modern UI with shadcn/ui components
- 🔄 Real-time player state management
- 🎼 Track listing with duration and playback controls

## Setup Instructions

### 1. Install Dependencies

The project dependencies are already configured. Run:

```bash
npm install
```

### 2. Add Your Music Files

1. Add your album cover image as `public/album-cover.jpg`
2. Add your audio files in the `public/audio/` directory:
   - `track-1.mp3` (Opening)
   - `track-2.mp3` (Revelation)
   - `track-3.mp3` (Metamorphosis)
   - `track-4.mp3` (Awakening)
   - `track-5.mp3` (Transcendence)
   - `track-6.mp3` (Eternal)

### 3. Customize Your Album Information

Edit `src/lib/music-data.ts` to update:
- Album title, artist name, and year
- Track titles and durations
- Audio file paths (if using different naming)

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
