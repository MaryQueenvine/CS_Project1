// services/moods.js
export const MOODS = [
  { value: 'very_happy', label: 'Very Happy', icon: '😄', color: '#4CAF50' },
  { value: 'happy', label: 'Happy', icon: '😊', color: '#8BC34A' },
  { value: 'neutral', label: 'Neutral', icon: '😐', color: '#FFC107' },
  { value: 'sad', label: 'Sad', icon: '😢', color: '#FF9800' },
  { value: 'very_sad', label: 'Very Sad', icon: '😭', color: '#F44336' },
  { value: 'angry', label: 'Angry', icon: '😡', color: '#E91E63' },
  { value: 'anxious', label: 'Anxious', icon: '😰', color: '#9C27B0' },
  { value: 'excited', label: 'Excited', icon: '🤩', color: '#FF5722' },
  { value: 'tired', label: 'Tired', icon: '😴', color: '#607D8B' },
  { value: 'stressed', label: 'Stressed', icon: '😵', color: '#795548' }
];

export const MOOD_CATEGORIES = {
  POSITIVE: ['very_happy', 'happy', 'excited'],
  NEUTRAL: ['neutral', 'tired'],
  NEGATIVE: ['sad', 'very_sad', 'angry', 'anxious', 'stressed']
};

export const getMoodByValue = (value) => {
  return MOODS.find(mood => mood.value === value);
};

export const getMoodCategory = (moodValue) => {
  for (const [category, moods] of Object.entries(MOOD_CATEGORIES)) {
    if (moods.includes(moodValue)) {
      return category;
    }
  }
  return 'NEUTRAL';
};