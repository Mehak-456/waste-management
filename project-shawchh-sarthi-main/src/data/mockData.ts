import { 
  User, 
  Task, 
  Issue, 
  PerformanceData, 
  LeaderboardEntry, 
  TrainingVideo,
  AreaCleanliness,
  CitizenReport,
  WorkerAuditRecord
} from '../types';

// Mock Users Database (Workers, Citizens, Municipal Authorities)
export const mockUsers: User[] = [
  // Sanitation Workers
  {
    id: '1',
    fullName: 'Rajesh Kumar',
    email: 'worker@swachhseva.in',
    role: 'worker',
    workerId: 'SW-101',
    mobile: '+91-9876543210',
    password: 'password123',
    team: 'Team A',
    zone: 'Sector A',
    joinDate: '2023-01-15',
    lastCheckup: '2024-08-15',
    healthStatus: 'Good'
  },
  {
    id: '2',
    fullName: 'Priya Sharma',
    role: 'worker',
    workerId: 'SW-102',
    mobile: '+91-9876543211',
    password: 'password123',
    team: 'Team B',
    zone: 'Sector B',
    joinDate: '2023-03-20',
    lastCheckup: '2024-07-20',
    healthStatus: 'Good'
  },
  {
    id: '3',
    fullName: 'Amit Singh',
    role: 'worker',
    workerId: 'SW-103',
    mobile: '+91-9876543212',
    password: 'password123',
    team: 'Team A',
    zone: 'Sector C',
    joinDate: '2023-05-12',
    lastCheckup: '2024-06-10',
    healthStatus: 'Needs Follow-up'
  },
  {
    id: '4',
    fullName: 'Sunita Devi',
    role: 'worker',
    workerId: 'SW-104',
    mobile: '+91-9876543213',
    password: 'password123',
    team: 'Team B',
    zone: 'Sector D',
    joinDate: '2023-07-25',
    lastCheckup: '2024-09-01',
    healthStatus: 'Good'
  },
  {
    id: '5',
    fullName: 'Vikram Yadav',
    role: 'worker',
    workerId: 'SW-105',
    mobile: '+91-9876543214',
    password: 'password123',
    team: 'Team C',
    zone: 'Sector E',
    joinDate: '2023-09-05',
    lastCheckup: '2024-08-05',
    healthStatus: 'Good'
  },

  // Citizens
  {
    id: 'c1',
    fullName: 'Pooja Verma',
    email: 'citizen@example.com',
    role: 'citizen',
    citizenId: 'CZ-101',
    mobile: '+91-9876500001',
    password: 'password123',
    zone: 'Sector A',
    joinDate: '2024-01-10'
  },
  {
    id: 'c2',
    fullName: 'Ramesh Patel',
    role: 'citizen',
    citizenId: 'CZ-102',
    mobile: '+91-9876500002',
    password: 'password123',
    zone: 'Sector B',
    joinDate: '2024-02-15'
  },
  {
    id: 'c3',
    fullName: 'Ananya Deshmukh',
    role: 'citizen',
    citizenId: 'CZ-103',
    mobile: '+91-9876500003',
    password: 'password123',
    zone: 'Sector C',
    joinDate: '2024-03-22'
  },

  // Municipal Authorities
  {
    id: 'a1',
    fullName: 'Dr. Ananya Roy',
    email: 'officer@municipal.gov.in',
    role: 'authority',
    authorityId: 'MUNI-01',
    mobile: '+91-9876599999',
    password: 'password123',
    zone: 'Zone 1 (All Sectors A-E)',
    designation: 'Chief Municipal Health & Sanitation Officer',
    department: 'Directorate of Municipal Solid Waste Management',
    joinDate: '2021-06-01'
  },
  {
    id: 'a2',
    fullName: 'K. S. Sharma',
    role: 'authority',
    authorityId: 'MUNI-02',
    mobile: '+91-9876588888',
    password: 'password123',
    zone: 'Sector A & B Field Units',
    designation: 'Zonal Chief Sanitary Inspector',
    department: 'Field Quality Assurance & Compliance',
    joinDate: '2022-04-12'
  }
];

// Mock Tasks for Route
export const mockTasks: Task[] = [
  {
    id: '1',
    routeName: 'Route 1: Sector A Collection',
    location: 'Green Park Main Gate',
    status: 'completed',
    lat: 28.5494,
    lng: 77.2066,
    weight: 25,
     proofBefore: "https://ik.imagekit.io/sihhackstone/greater_noida_door_to_door_waste-collection_1631556299135_1631556299453.jpeg",
    proofAfter: "https://ik.imagekit.io/sihhackstone/unnamed.png"
  },
  {
    id: '2',
    routeName: 'Route 1: Sector A Collection',
    location: 'Community Center Block A',
    status: 'completed',
    lat: 28.5504,
    lng: 77.2076,
    weight: 18,
     proofBefore: "https://ik.imagekit.io/sihhackstone/Gemini_Genevr2063vr2.png?updatedAt=1758101678699",
    proofAfter: "https://ik.imagekit.io/sihhackstone/Gem256.png?updatedAt=1758102184684"
  },
  {
    id: '3',
    routeName: 'Route 1: Sector A Collection',
    location: 'Market Complex',
    status: 'pending',
    lat: 28.5524,
    lng: 77.2096,
    weight: 0
  },
  {
    id: '4',
    routeName: 'Route 1: Sector A Collection',
    location: 'Residential Area Phase 1',
    status: 'pending',
    lat: 28.5534,
    lng: 77.2106,
    weight: 0
  },
  {
    id: '5',
    routeName: 'Route 1: Sector A Collection',
    location: 'School Compound',
    status: 'pending',
    lat: 28.5544,
    lng: 77.2116,
    weight: 0
  }
];

// Mock Performance Data
export const mockPerformanceData: PerformanceData[] = [
  { day: 'Mon', collections: 15, weight: 120 },
  { day: 'Tue', collections: 18, weight: 145 },
  { day: 'Wed', collections: 12, weight: 98 },
  { day: 'Thu', collections: 20, weight: 165 },
  { day: 'Fri', collections: 16, weight: 130 },
  { day: 'Sat', collections: 22, weight: 180 },
  { day: 'Sun', collections: 14, weight: 110 }
];

// Mock Leaderboard
export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Amit Singh', collections: 145, points: 1450 },
  { rank: 2, name: 'Rajesh Kumar', collections: 132, points: 1320 },
  { rank: 3, name: 'Priya Sharma', collections: 128, points: 1280 }
];

// Mock Training Videos

  export const mockTrainingVideos: TrainingVideo[] = [
  {
    id: '1',
    title: 'Proper Waste Segregation Techniques',
    duration: '1:32',
    thumbnail: 'https://vincular.in/wp-content/uploads/2023/11/Know-your-waste.png',
    description: 'Learn the fundamentals of waste segregation and proper handling techniques.',
    category: 'Safety',
    url: 'https://collection.cloudinary.com/dmfmgutg6/5c879f00d54e4262b0e7a3de43d7bb77'
  },
  {
    id: '2',
    title: 'Personal Safety Equipment Usage',
    duration: '6:15',
    thumbnail: 'https://uppler-platform-otego.s3.eu-west-3.amazonaws.com/uppler_default/98/af/985ab1c83bc8374a1ef0f16cd62d.webp',
    description: 'Complete guide to using safety equipment correctly.',
    category: 'Safety',
    url: 'https://collection.cloudinary.com/dmfmgutg6/3b3885078f957018c3109d37b5e64180'
  },
  {
    id: '3',
    title: 'Efficient Route Planning',
    duration: '12:45',
    thumbnail: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=300',
    description: 'Optimize your collection routes for maximum efficiency.',
    category: 'Efficiency',
    url: 'https://collection.cloudinary.com/dmfmgutg6/4dea0c1f9aa3b1e38f8004dbacb80769'
  },
  {
    id: '4',
    title: 'Emergency Response Procedures',
    duration: '10:20',
    thumbnail: 'https://as2.ftcdn.net/jpg/02/23/61/03/1000_F_223610323_kbLysI0UTi9lhyu1kEIUpAFf8YOgXki7.jpg',
    description: 'What to do in case of emergencies during waste collection.',
    category: 'Emergency',
    url: 'https://collection.cloudinary.com/dmfmgutg6/e7f56851e3e869b3f36b5a4d821aec3f'
  }
];

// Mock Issues
export const mockIssues: Issue[] = [
  {
    id: '1',
    workerId: 'SW-101',
    title: 'Bin Overflowing',
    description: 'Large bin at Green Park is overflowing and needs immediate attention.',
    category: 'Bin Full',
    timestamp: '2024-01-15T10:30:00Z'
  }
];

// Helper functions for mock database operations
export const saveUser = (user: User) => {
  const existingIndex = mockUsers.findIndex(u => 
    (user.workerId && u.workerId === user.workerId) || 
    (user.citizenId && u.citizenId === user.citizenId) ||
    (user.authorityId && u.authorityId === user.authorityId) ||
    u.id === user.id
  );
  if (existingIndex >= 0) {
    mockUsers[existingIndex] = user;
  } else {
    mockUsers.push(user);
  }
};

export const findUserByCredentials = (identifier: string, password: string): User | null => {
  const trimmed = identifier.trim().toLowerCase();
  return mockUsers.find(user => {
    const matchesId = 
      (user.workerId && user.workerId.toLowerCase() === trimmed) ||
      (user.citizenId && user.citizenId.toLowerCase() === trimmed) ||
      (user.authorityId && user.authorityId.toLowerCase() === trimmed) ||
      user.mobile.toLowerCase() === trimmed ||
      user.fullName.toLowerCase() === trimmed;
    
    return matchesId && user.password === password;
  }) || null;
};

export const findUserById = (id: string): User | null => {
  return mockUsers.find(user => user.id === id) || null;
};

export const updateTaskStatus = (
  taskId: string,
  status: 'pending' | 'in-progress' | 'completed',
  weight?: number,
  proofBefore?: string,
  proofAfter?: string
) => {
  const task = mockTasks.find(t => t.id === taskId);
  if (task) {
    task.status = status;

    if (weight !== undefined) {
      task.weight = weight;
    }

    if (proofBefore) {
      task.proofBefore = proofBefore;
    }

    if (proofAfter) {
      task.proofAfter = proofAfter;
    }
  }
};

export const addIssue = (issue: Issue) => {
  mockIssues.push(issue);
};

export const getTasksForUser = (): Task[] => {
  return mockTasks;
};

// Mock Areas Cleanliness Data
export const mockAreas: AreaCleanliness[] = [
  {
    id: 'area-1',
    name: 'Green Park Main Gate & Sector A',
    zone: 'Sector A',
    ward: 'Ward 14',
    cleanlinessScore: 95,
    status: 'clean',
    lastCleanedTime: 'Today at 08:30 AM',
    assignedWorkerName: 'Rajesh Kumar',
    assignedWorkerId: 'SW-101',
    lat: 28.5494,
    lng: 77.2066,
    proofBefore: 'https://ik.imagekit.io/sihhackstone/greater_noida_door_to_door_waste-collection_1631556299135_1631556299453.jpeg',
    proofAfter: 'https://ik.imagekit.io/sihhackstone/unnamed.png',
    verifiedByCitizenCount: 42,
    totalReports: 1,
    nextScheduledCollection: 'Tomorrow 07:30 AM',
    wasteTypesCollected: ['Dry Waste', 'Wet Waste', 'Plastic Bins']
  },
  {
    id: 'area-2',
    name: 'Community Center & Block A Market',
    zone: 'Sector A',
    ward: 'Ward 14',
    cleanlinessScore: 91,
    status: 'clean',
    lastCleanedTime: 'Today at 09:45 AM',
    assignedWorkerName: 'Rajesh Kumar',
    assignedWorkerId: 'SW-101',
    lat: 28.5504,
    lng: 77.2076,
    proofBefore: 'https://ik.imagekit.io/sihhackstone/Gemini_Genevr2063vr2.png?updatedAt=1758101678699',
    proofAfter: 'https://ik.imagekit.io/sihhackstone/Gem256.png?updatedAt=1758102184684',
    verifiedByCitizenCount: 29,
    totalReports: 0,
    nextScheduledCollection: 'Tomorrow 08:15 AM',
    wasteTypesCollected: ['Commercial Waste', 'Cardboard', 'Organic']
  },
  {
    id: 'area-3',
    name: 'Sector B Central Market & Plaza',
    zone: 'Sector B',
    ward: 'Ward 18',
    cleanlinessScore: 82,
    status: 'in-progress',
    lastCleanedTime: 'Yesterday at 04:15 PM',
    assignedWorkerName: 'Priya Sharma',
    assignedWorkerId: 'SW-102',
    lat: 28.5524,
    lng: 77.2096,
    proofBefore: 'https://ik.imagekit.io/sihhackstone/greater_noida_door_to_door_waste-collection_1631556299135_1631556299453.jpeg',
    verifiedByCitizenCount: 16,
    totalReports: 2,
    nextScheduledCollection: 'Today 02:30 PM (In-Transit)',
    wasteTypesCollected: ['Market Waste', 'Dry Waste']
  },
  {
    id: 'area-4',
    name: 'Sector C Residential Complex Phase 2',
    zone: 'Sector C',
    ward: 'Ward 22',
    cleanlinessScore: 68,
    status: 'needs-attention',
    lastCleanedTime: 'Yesterday at 11:00 AM',
    assignedWorkerName: 'Amit Singh',
    assignedWorkerId: 'SW-103',
    lat: 28.5534,
    lng: 77.2106,
    verifiedByCitizenCount: 8,
    totalReports: 3,
    nextScheduledCollection: 'Today 03:00 PM (Priority)',
    wasteTypesCollected: ['Household Garbage', 'Bio-degradable']
  },
  {
    id: 'area-5',
    name: 'Sector D School & Playground Perimeter',
    zone: 'Sector D',
    ward: 'Ward 25',
    cleanlinessScore: 88,
    status: 'clean',
    lastCleanedTime: 'Today at 07:15 AM',
    assignedWorkerName: 'Sunita Devi',
    assignedWorkerId: 'SW-104',
    lat: 28.5544,
    lng: 77.2116,
    proofBefore: 'https://ik.imagekit.io/sihhackstone/greater_noida_door_to_door_waste-collection_1631556299135_1631556299453.jpeg',
    proofAfter: 'https://ik.imagekit.io/sihhackstone/Gem256.png?updatedAt=1758102184684',
    verifiedByCitizenCount: 35,
    totalReports: 0,
    nextScheduledCollection: 'Tomorrow 07:00 AM',
    wasteTypesCollected: ['Paper/Stationery Waste', 'Dry Waste']
  }
];

// Mock Citizen Complaints / Grievances
export const mockCitizenReports: CitizenReport[] = [
  {
    id: 'CR-1001',
    citizenId: 'CZ-101',
    citizenName: 'Pooja Verma',
    citizenMobile: '+91-9876500001',
    location: 'Sector A, Behind Community Center Park',
    zone: 'Sector A',
    issueType: 'overflowing-bin',
    description: 'Community dustbin overflowing with garden cuttings and kitchen waste since yesterday evening.',
    photo: 'https://ik.imagekit.io/sihhackstone/greater_noida_door_to_door_waste-collection_1631556299135_1631556299453.jpeg',
    timestamp: '2024-03-24T08:15:00Z',
    status: 'resolved',
    assignedToWorker: 'Rajesh Kumar (SW-101)',
    resolvedPhoto: 'https://ik.imagekit.io/sihhackstone/unnamed.png',
    resolutionNotes: 'Collected and sanitized bin at 09:30 AM by Sector A route crew.'
  },
  {
    id: 'CR-1002',
    citizenId: 'CZ-102',
    citizenName: 'Ramesh Patel',
    citizenMobile: '+91-9876500002',
    location: 'Sector B Market lane near ATM',
    zone: 'Sector B',
    issueType: 'garbage-dump',
    description: 'Illegal dumping of plastic packaging bags beside the vegetable stalls blocking walking pathway.',
    photo: 'https://ik.imagekit.io/sihhackstone/Gemini_Genevr2063vr2.png?updatedAt=1758101678699',
    timestamp: '2024-03-24T10:45:00Z',
    status: 'in-progress',
    assignedToWorker: 'Priya Sharma (SW-102)',
    resolutionNotes: 'Dispatched secondary cleanup vehicle DL-1WA-204.'
  },
  {
    id: 'CR-1003',
    citizenId: 'CZ-103',
    citizenName: 'Ananya Deshmukh',
    citizenMobile: '+91-9876500003',
    location: 'Sector C, Main Gate of Block 3',
    zone: 'Sector C',
    issueType: 'missed-pickup',
    description: 'Morning door-to-door waste vehicle missed Block 3 residential row today.',
    timestamp: '2024-03-24T11:20:00Z',
    status: 'pending',
    assignedToWorker: 'Amit Singh (SW-103)'
  }
];

// Mock Worker Audit Records for Municipal Authority Review
export const mockWorkerAudits: WorkerAuditRecord[] = [
  {
    workerId: 'SW-101',
    workerName: 'Rajesh Kumar',
    zone: 'Sector A',
    tasksAssigned: 5,
    tasksCompleted: 4,
    totalWeightKg: 43,
    photoComplianceScore: 98,
    auditStatus: 'approved',
    calculatedIncentive: 450
  },
  {
    workerId: 'SW-102',
    workerName: 'Priya Sharma',
    zone: 'Sector B',
    tasksAssigned: 5,
    tasksCompleted: 3,
    totalWeightKg: 35,
    photoComplianceScore: 92,
    auditStatus: 'approved',
    calculatedIncentive: 380
  },
  {
    workerId: 'SW-103',
    workerName: 'Amit Singh',
    zone: 'Sector C',
    tasksAssigned: 6,
    tasksCompleted: 5,
    totalWeightKg: 52,
    photoComplianceScore: 99,
    auditStatus: 'approved',
    calculatedIncentive: 550
  },
  {
    workerId: 'SW-104',
    workerName: 'Sunita Devi',
    zone: 'Sector D',
    tasksAssigned: 4,
    tasksCompleted: 3,
    totalWeightKg: 31,
    photoComplianceScore: 90,
    auditStatus: 'under-review',
    calculatedIncentive: 320
  },
  {
    workerId: 'SW-105',
    workerName: 'Vikram Yadav',
    zone: 'Sector E',
    tasksAssigned: 5,
    tasksCompleted: 2,
    totalWeightKg: 22,
    photoComplianceScore: 78,
    auditStatus: 'under-review',
    calculatedIncentive: 210
  }
];

export const getAreas = (): AreaCleanliness[] => {
  return mockAreas;
};

export const voteAreaCleanliness = (areaId: string, isClean: boolean) => {
  const area = mockAreas.find(a => a.id === areaId);
  if (area) {
    if (isClean) {
      area.verifiedByCitizenCount += 1;
      area.cleanlinessScore = Math.min(100, area.cleanlinessScore + 1);
    } else {
      area.cleanlinessScore = Math.max(20, area.cleanlinessScore - 4);
      if (area.cleanlinessScore < 70) {
        area.status = 'needs-attention';
      }
    }
  }
};

export const getCitizenReports = (): CitizenReport[] => {
  return mockCitizenReports;
};

export const addCitizenReport = (report: CitizenReport) => {
  mockCitizenReports.unshift(report);
  const area = mockAreas.find(a => a.zone === report.zone);
  if (area) {
    area.totalReports += 1;
    area.status = 'needs-attention';
    area.cleanlinessScore = Math.max(30, area.cleanlinessScore - 5);
  }
};

export const updateCitizenReportStatus = (
  reportId: string, 
  status: 'pending' | 'assigned' | 'in-progress' | 'resolved',
  notes?: string
) => {
  const report = mockCitizenReports.find(r => r.id === reportId);
  if (report) {
    report.status = status;
    if (notes) {
      report.resolutionNotes = notes;
    }
    if (status === 'resolved') {
      report.resolvedPhoto = 'https://ik.imagekit.io/sihhackstone/unnamed.png';
    }
  }
};

export const getWorkerAudits = (): WorkerAuditRecord[] => {
  return mockWorkerAudits;
};

export const updateWorkerAuditStatus = (workerId: string, status: 'approved' | 'under-review' | 'flagged') => {
  const audit = mockWorkerAudits.find(a => a.workerId === workerId);
  if (audit) {
    audit.auditStatus = status;
  }
};
