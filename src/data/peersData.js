/**
 * Mock peer database — 6 elderly user profiles.
 * Used by the matchmaking engine in PeersScreen.
 *
 * Fields:
 *   mobility_status : 'High' | 'Low'
 *   grief_status    : 'Alone' | 'With Family'
 *   language        : 'hindi' | 'english'
 */
export const PEER_PROFILES = [
  {
    id: 1,
    name: 'Ramesh Sharma',
    age: 68,
    city: 'Lucknow',
    avatar: '👴',
    mobility_status: 'Low',
    grief_status: 'Alone',
    language: 'hindi',
    interests: ['Gardening', 'Cricket', 'Bhajans'],
    bio: 'Retired school teacher. Lost my wife 2 years ago. Love talking about old Bollywood.',
    responseTime: 'Usually replies within an hour',
  },
  {
    id: 2,
    name: 'Savitri Devi',
    age: 72,
    city: 'Varanasi',
    avatar: '👵',
    mobility_status: 'Low',
    grief_status: 'Alone',
    language: 'hindi',
    interests: ['Cooking', 'Bhajans', 'Knitting'],
    bio: 'Spent 40 years raising my family. Now the house feels quiet. I love sharing recipes.',
    responseTime: 'Usually replies in the evening',
  },
  {
    id: 3,
    name: 'Mohan Lal',
    age: 70,
    city: 'Jaipur',
    avatar: '👴',
    mobility_status: 'Low',
    grief_status: 'With Family',
    language: 'hindi',
    interests: ['Chess', 'History', 'Walking'],
    bio: 'Retired government officer. My children are busy but I enjoy good conversations.',
    responseTime: 'Usually replies in the morning',
  },
  {
    id: 4,
    name: 'Meena Iyer',
    age: 66,
    city: 'Chennai',
    avatar: '👵',
    mobility_status: 'High',
    grief_status: 'Alone',
    language: 'english',
    interests: ['Reading', 'Yoga', 'Cooking'],
    bio: 'Retired nurse. I lost my husband last year. I enjoy reading and morning walks.',
    responseTime: 'Usually replies quickly',
  },
  {
    id: 5,
    name: 'Suresh Patel',
    age: 74,
    city: 'Ahmedabad',
    avatar: '👴',
    mobility_status: 'High',
    grief_status: 'With Family',
    language: 'hindi',
    interests: ['Business', 'Cricket', 'Travel'],
    bio: 'Retired businessman. I live with my son\'s family but miss having peers to talk to.',
    responseTime: 'Usually replies in the afternoon',
  },
  {
    id: 6,
    name: 'Kamla Verma',
    age: 69,
    city: 'Bhopal',
    avatar: '👵',
    mobility_status: 'Low',
    grief_status: 'Alone',
    language: 'hindi',
    interests: ['Bhajans', 'Gardening', 'Cooking'],
    bio: 'My children are settled abroad. I spend my days in prayer and gardening.',
    responseTime: 'Usually replies in the morning',
  },
]

/**
 * matchPeers — scoring-based matchmaking engine.
 *
 * Scoring rules (higher = better match):
 *   +4  exact mobility_status match
 *   +4  exact grief_status match   (shared pain = strongest bond)
 *   +3  same language
 *   +2  both Low mobility AND both Alone (double-weight for shared hardship)
 *
 * Returns top `limit` profiles sorted by score descending.
 */
export function matchPeers(currentUser, limit = 2) {
  const scored = PEER_PROFILES.map(peer => {
    let score = 0

    // Mobility match
    if (peer.mobility_status === currentUser.mobility_status) score += 4

    // Grief / living situation match
    if (peer.grief_status === currentUser.grief_status) score += 4

    // Language match
    if (peer.language === currentUser.language) score += 3

    // Bonus: both Low mobility AND both Alone — strongest empathy bond
    if (
      peer.mobility_status === 'Low' && currentUser.mobility_status === 'Low' &&
      peer.grief_status === 'Alone'  && currentUser.grief_status === 'Alone'
    ) {
      score += 2
    }

    return { ...peer, matchScore: score }
  })

  // Sort descending by score, then by age proximity as tiebreaker
  scored.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore
    return Math.abs(a.age - currentUser.age ?? 68) - Math.abs(b.age - currentUser.age ?? 68)
  })

  return scored.slice(0, limit)
}
