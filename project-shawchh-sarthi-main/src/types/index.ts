export interface User {
  id: string;
  fullName: string;
  workerId: string;
  mobile: string;
  password: string;
  team: string;
  zone: string;
  joinDate: string;
  lastCheckup: string;
  healthStatus: string;
}

export interface Task {
  id: string;
  routeName: string;
  location: string;
  status: 'pending' | 'in-progress' | 'completed'; 
  lat: number;
  lng: number;
  weight?: number;
  proofBefore?: string;  
  proofAfter?: string; 
}


export interface Issue {
  id: string;
  workerId: string;
  title: string;
  description: string;
  category: string;
  timestamp: string;
  photo?: string;
}

export interface PerformanceData {
  day: string;
  collections: number;
  weight: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  collections: number;
  points: number;
}

export interface TrainingVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  description: string;
  category: string;
  url: string;
}