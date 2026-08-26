export interface Reel {
  id: string
  title: string
  category: string
  video: string
}

// Reuses the two real gym-floor clips already in the repo (no dedicated
// per-reel footage exists) so every card plays real video, not a placeholder.
export const REELS: Reel[] = [
  { id: 'reel-1', title: 'Deadlift PR Day', category: 'Heavy Lifting', video: '/videos/VID_2.mp4' },
  { id: 'reel-2', title: 'Sprint Intervals', category: 'Cardio & Kinetic', video: '/videos/VID_1.mp4' },
  { id: 'reel-3', title: 'Post-Workout Shake', category: 'Fuel & Recovery', video: '/videos/VID_2.mp4' },
  { id: 'reel-4', title: 'Rack Loaded Squats', category: 'Heavy Lifting', video: '/videos/VID_2.mp4' },
  { id: 'reel-5', title: 'HIIT Circuit Finisher', category: 'Cardio & Kinetic', video: '/videos/VID_1.mp4' },
  { id: 'reel-6', title: 'Gym Floor Tour', category: 'Inside Stay Fit', video: '/videos/VID_1.mp4' },
]
