export interface Reel {
  id: string
  title: string
  category: string
  video: string
  gradient: string
}

export const REELS: Reel[] = [
  {
    id: 'reel-1',
    title: 'Deadlift PR Day',
    category: 'Heavy Lifting',
    video: '/videos/reels/reel-1.mp4',
    gradient: 'from-blue/40 via-obsidian to-obsidian',
  },
  {
    id: 'reel-2',
    title: 'Sprint Intervals',
    category: 'Cardio & Kinetic',
    video: '/videos/reels/reel-2.mp4',
    gradient: 'from-orange/40 via-obsidian to-obsidian',
  },
  {
    id: 'reel-3',
    title: 'Post-Workout Shake',
    category: 'Fuel & Recovery',
    video: '/videos/reels/reel-3.mp4',
    gradient: 'from-cyan/30 via-blue/20 to-obsidian',
  },
  {
    id: 'reel-4',
    title: 'Rack Loaded Squats',
    category: 'Heavy Lifting',
    video: '/videos/reels/reel-4.mp4',
    gradient: 'from-orange/30 via-obsidian to-obsidian',
  },
  {
    id: 'reel-5',
    title: 'HIIT Circuit Finisher',
    category: 'Cardio & Kinetic',
    video: '/videos/reels/reel-5.mp4',
    gradient: 'from-blue/40 via-obsidian to-obsidian',
  },
  {
    id: 'reel-6',
    title: 'Gym Floor Tour',
    category: 'Inside Stay Fit',
    video: '/videos/reels/reel-6.mp4',
    gradient: 'from-orange/20 via-blue/20 to-obsidian',
  },
]
