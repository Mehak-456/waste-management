export type UserRole = 'worker' | 'citizen' | 'authority';

export interface User {
  id: string;
  fullName: string;
  email?: string;
  role: UserRole;
  workerId?: string;
  citizenId?: string;
  authorityId?: string;
  mobile: string;
  password?: string;
  team?: string;
  zone: string;
  department?: string;
  designation?: string;
  joinDate: string;
  lastCheckup?: string;
  healthStatus?: string;
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

export interface AreaCleanliness {
  id: string;
  name: string;
  zone: string;
  ward: string;
  cleanlinessScore: number; // 0 - 100
  status: 'clean' | 'in-progress' | 'needs-attention';
  lastCleanedTime: string;
  assignedWorkerName: string;
  assignedWorkerId: string;
  lat: number;
  lng: number;
  proofBefore?: string;
  proofAfter?: string;
  verifiedByCitizenCount: number;
  totalReports: number;
  nextScheduledCollection: string;
  wasteTypesCollected: string[];
}

export interface CitizenReport {
  id: string;
  citizenId: string;
  citizenName: string;
  citizenMobile: string;
  location: string;
  zone: string;
  issueType: 'overflowing-bin' | 'garbage-dump' | 'blocked-drain' | 'missed-pickup' | 'other';
  description: string;
  photo?: string;
  timestamp: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved';
  assignedToWorker?: string;
  resolvedPhoto?: string;
  resolutionNotes?: string;
}

export interface WorkerAuditRecord {
  workerId: string;
  workerName: string;
  zone: string;
  tasksAssigned: number;
  tasksCompleted: number;
  totalWeightKg: number;
  photoComplianceScore: number;
  auditStatus: 'approved' | 'under-review' | 'flagged';
  calculatedIncentive: number;
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