import { User, Task, Issue, PerformanceData, LeaderboardEntry, TrainingVideo } from '../types';

// Mock Users Database
export const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'Rajesh Kumar',
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
    workerId: 'SW-105',
    mobile: '+91-9876543214',
    password: 'password123',
    team: 'Team C',
    zone: 'Sector E',
    joinDate: '2023-09-05',
    lastCheckup: '2024-08-05',
    healthStatus: 'Good'
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
export let mockIssues: Issue[] = [
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
  const existingIndex = mockUsers.findIndex(u => u.workerId === user.workerId);
  if (existingIndex >= 0) {
    mockUsers[existingIndex] = user;
  } else {
    mockUsers.push(user);
  }
};

export const findUserByCredentials = (workerId: string, password: string): User | null => {
  return mockUsers.find(user => user.workerId === workerId && user.password === password) || null;
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
