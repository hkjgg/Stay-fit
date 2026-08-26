export interface Reel {
  id: string
  title: string
  category: string
  video: string
  /** Playback speed and starting frame offset (seconds) so cards sharing one
   *  of the two real source clips still play as visually distinct footage. */
  playbackRate: number
  frameOffset: number
}

// Reuses the two real gym-floor clips already in the repo (no dedicated
// per-reel footage exists) so every card plays real video, not a placeholder.
export const REELS: Reel[] = [
  { id: 'reel-1', title: 'Deadlift PR Day', category: 'Heavy Lifting', video: '/videos/VID_2.mp4', playbackRate: 1, frameOffset: 0 },
  { id: 'reel-2', title: 'Sprint Intervals', category: 'Cardio & Kinetic', video: '/videos/VID_1.mp4', playbackRate: 1.4, frameOffset: 1 },
  { id: 'reel-3', title: 'Post-Workout Shake', category: 'Fuel & Recovery', video: '/videos/VID_2.mp4', playbackRate: 0.85, frameOffset: 2.5 },
  { id: 'reel-4', title: 'Rack Loaded Squats', category: 'Heavy Lifting', video: '/videos/VID_2.mp4', playbackRate: 1.15, frameOffset: 4 },
  { id: 'reel-5', title: 'HIIT Circuit Finisher', category: 'Cardio & Kinetic', video: '/videos/VID_1.mp4', playbackRate: 1.5, frameOffset: 2 },
  { id: 'reel-6', title: 'Gym Floor Tour', category: 'Inside Stay Fit', video: '/videos/VID_1.mp4', playbackRate: 0.9, frameOffset: 3.5 },
]
