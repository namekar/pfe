// PocketWatch/lib/newsSources.js

export const NEWS_SOURCES = [
  {
    id: 'javma',
    name: 'JAVMA',
    url: 'https://avmajournals.avma.org/action/showFeed?type=etoc&feed=rss&jc=avmaj',
    type: 'rss',
    category: 'research',
    icon: '📘',
    enabled: true
  },
  {
    id: 'avma',
    name: 'AVMA News',
    url: 'https://www.avma.org/news/rss.xml',
    type: 'rss',
    category: 'practice',
    icon: '📗',
    enabled: true
  },
  {
    id: 'cdc',
    name: 'CDC Animal Health',
    url: 'https://www.cdc.gov/animalhealth/rss.xml',
    type: 'rss',
    category: 'outbreak',
    icon: '🦠',
    enabled: true
  },
  {
    id: 'fda',
    name: 'FDA Veterinary',
    url: 'https://www.fda.gov/animal-veterinary/rss.xml',
    type: 'rss',
    category: 'drugs',
    icon: '💊',
    enabled: true
  },
  {
    id: 'vetrec',
    name: 'VetRec',
    url: 'https://vetrec.com/rss',
    type: 'rss',
    category: 'research',
    icon: '📚',
    enabled: false // API key needed
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All', icon: '📰', color: '#6B887A' },
  { id: 'research', name: 'Research', icon: '🔬', color: '#32B36A' },
  { id: 'drugs', name: 'Drug Updates', icon: '💊', color: '#FF6B6B' },
  { id: 'outbreak', name: 'Disease Alerts', icon: '⚠️', color: '#FFA500' },
  { id: 'practice', name: 'Practice Mgmt', icon: '🏥', color: '#4A90E2' },
  { id: 'events', name: 'Events', icon: '📅', color: '#9B59B6' }
];

export const generateMockNews = () => {
  return [
    {
      id: '1',
      title: 'New Study Shows Benefits of Early CBD Treatment in Canine Osteoarthritis',
      source: 'JAVMA',
      sourceIcon: '📘',
      category: 'research',
      summary: 'A 12-week study of 80 dogs with osteoarthritis showed significant improvement in mobility and pain reduction with CBD treatment. Researchers noted 67% of dogs showed measurable improvement within 4 weeks.',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      url: 'https://example.com/article1',
      imageUrl: null,
      relevanceScore: 92
    },
    {
      id: '2',
      title: 'FDA Approves New Treatment for Feline Diabetes',
      source: 'FDA Veterinary',
      sourceIcon: '💊',
      category: 'drugs',
      summary: 'The FDA has approved Bexagliflozin, a new oral medication for feline diabetes. This is the first new treatment option in over 5 years and shows promising results with once-daily dosing.',
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      url: 'https://example.com/article2',
      imageUrl: null,
      relevanceScore: 88
    },
    {
      id: '3',
      title: 'Canine Influenza Outbreak Reported in Midwest Region',
      source: 'CDC Animal Health',
      sourceIcon: '🦠',
      category: 'outbreak',
      summary: 'Multiple cases of H3N2 canine influenza have been confirmed in Illinois, Indiana, and Ohio. Veterinarians are advised to be vigilant and consider vaccination for high-risk patients.',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      url: 'https://example.com/article3',
      imageUrl: null,
      relevanceScore: 95
    },
    {
      id: '4',
      title: 'AVMA Updates Guidelines for Telemedicine',
      source: 'AVMA News',
      sourceIcon: '📗',
      category: 'practice',
      summary: 'The AVMA has released updated guidelines for telemedicine in veterinary practice. The new guidelines clarify the veterinarian-client-patient relationship requirements for remote consultations.',
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      url: 'https://example.com/article4',
      imageUrl: null,
      relevanceScore: 85
    },
    {
      id: '5',
      title: 'World Veterinary Congress 2024 Announced',
      source: 'AVMA News',
      sourceIcon: '📗',
      category: 'events',
      summary: 'The 39th World Veterinary Congress will take place in Cape Town, South Africa from October 20-24, 2024. Early bird registration is now open with special rates for AVMA members.',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      url: 'https://example.com/article5',
      imageUrl: null,
      relevanceScore: 75
    }
  ];
};

export const categorizeByRelevance = (news, userPreferences = {}) => {
  // Sort by relevance score and recency
  return [...news].sort((a, b) => {
    // Weight: 70% relevance score, 30% recency
    const aScore = (a.relevanceScore * 0.7) + (getRecencyScore(a.publishedAt) * 0.3);
    const bScore = (b.relevanceScore * 0.7) + (getRecencyScore(b.publishedAt) * 0.3);
    return bScore - aScore;
  });
};

const getRecencyScore = (date) => {
  const hoursDiff = (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60);
  if (hoursDiff < 24) return 1;
  if (hoursDiff < 48) return 0.8;
  if (hoursDiff < 72) return 0.6;
  if (hoursDiff < 168) return 0.4; // 7 days
  return 0.2;
};