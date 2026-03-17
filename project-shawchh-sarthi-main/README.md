# Swachh Seva - Municipal Waste Management Worker Platform

## 🌟 Project Overview

**Swachh Seva** (meaning "Clean Service" in Hindi) is a comprehensive digital platform designed to revolutionize municipal waste management operations. This system empowers sanitation workers employed by municipal corporations to efficiently track, report, and showcase their work to authorities, ensuring proper wage distribution, performance-based increments, and transparent accountability.

## 🎯 Project Vision

To create a transparent, accountable, and efficient waste management ecosystem where every sanitation worker's contribution is recognized, tracked, and fairly compensated by municipal authorities through digital verification and performance analytics.

## 👥 Target Users

### Primary Users:
- **Sanitation Workers** - Municipal corporation employees engaged in waste collection
- **Field Supervisors** - Team leaders and zone managers  
- **Municipal Authorities** - Officials responsible for wage disbursement and performance evaluation

### Secondary Users:
- **HR Department** - Employee management and increment processing
- **Finance Department** - Wage calculation and disbursement
- **Public Health Officials** - Monitoring sanitation standards
- **Citizens** - Improved service delivery and transparency

## 🚀 Key Features

### 📱 For Sanitation Workers

#### 1. **Digital Work Tracking & Verification**
- **GPS-Based Route Tracking**: Real-time location monitoring during collection rounds
- **Photo Proof System**: Before/after collection photos with GPS coordinates and timestamps
- **Weight Recording**: Digital measurement tracking for collected waste
- **Task Completion Verification**: Two-step verification process (capture before → capture after)

#### 2. **Performance Dashboard & Analytics**
- **Personal Metrics**: Individual performance tracking and analytics
- **Progress Visualization**: Weekly/monthly collection statistics with charts
- **Leaderboard Ranking**: Competitive element among peers
- **Achievement System**: Badges and recognition for milestones

#### 3. **Training & Development Hub**
- **Video-Based Learning**: 4 comprehensive training modules covering:
  - Safety protocols and equipment usage (1:32 + 6:15 mins)
  - Efficient collection techniques (12:45 mins)
  - Emergency response procedures (10:20 mins)
- **Skill Certification**: Progress tracking and competency validation
- **Safety Guidelines**: Essential safety rules reference

#### 4. **Issue Reporting System**
- **Real-Time Reporting**: Report overflowing bins, equipment malfunctions, safety hazards
- **Photo Documentation**: Visual evidence with issue reports
- **Category Classification**: Structured issue types (bin-full, access-blocked, hazard-safety, equipment-issue)
- **Tracking System**: Unique ID assignment for each reported issue

#### 5. **Health & Safety Monitoring**
- **Digital Health Records**: Checkup history and status tracking
- **Safety Compliance**: Equipment usage verification
- **Emergency Contacts**: Direct access to emergency hotlines

### 🏛️ For Municipal Authorities

#### 1. **Performance Analytics & Reporting**
- **Individual Worker Reports**: Detailed performance metrics per worker
- **Team Productivity Analysis**: Zone-wise and team-wise efficiency tracking
- **Collection Analytics**: Volume, weight, and route optimization data
- **Real-Time Monitoring**: Live tracking of field operations

#### 2. **Transparent Wage Management**
```
Automated Wage Calculation Formula:
Base Wage + Performance Bonus + Quality Bonus + Efficiency Bonus

Where:
- Performance Bonus = (Collections Completed / Target) × Bonus Rate
- Quality Bonus = Photo Verification Score × Quality Rate  
- Efficiency Bonus = Route Completion Time Bonus
```

#### 3. **Increment & Promotion System**
| Criteria | Weight | Measurement Method |
|----------|---------|-------------------|
| Task Completion Rate | 30% | Daily target achievement tracking |
| Quality Score | 25% | Photo verification & GPS accuracy |
| Training Completion | 20% | Skill development progress |
| Attendance & Punctuality | 15% | Login/logout tracking |
| Safety Compliance | 10% | Health checkups & protocol adherence |

#### 4. **Resource Optimization**
- **Route Planning**: AI-assisted optimal route generation
- **Vehicle Allocation**: Equipment and workforce distribution
- **Budget Forecasting**: Cost analysis and resource planning
- **Issue Resolution Tracking**: Problem identification and resolution metrics

## 🛠️ Technical Architecture

### Frontend Stack
- **Framework**: React 18.3.1 with TypeScript
- **Styling**: Tailwind CSS 3.4.1 for responsive design
- **Routing**: React Router DOM 7.9.1 for navigation
- **Charts**: Recharts 3.2.0 for performance visualization
- **Maps**: Leaflet 1.9.4 for GPS tracking and route visualization
- **Icons**: Lucide React 0.344.0 for consistent iconography
- **Build Tool**: Vite 7.1.5 for fast development and building

### Key Libraries & Dependencies
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1", 
  "react-router-dom": "^7.9.1",
  "recharts": "^3.2.0",
  "leaflet": "^1.9.4",
  "lucide-react": "^0.344.0",
  "tailwindcss": "^3.4.1"
}
```

### Data Architecture

#### User Management System
```typescript
interface User {
  id: string;
  fullName: string;
  workerId: string;        // Format: SW-XXX
  mobile: string;
  password: string;
  team: string;           // Team A, B, C
  zone: string;           // Sector assignment
  joinDate: string;
  lastCheckup: string;
  healthStatus: string;
}
```

#### Task Tracking System
```typescript
interface Task {
  id: string;
  routeName: string;
  location: string;
  status: 'pending' | 'in-progress' | 'completed';
  lat: number;            // GPS coordinates
  lng: number;
  weight?: number;        // Collected weight in kg
  proofBefore?: string;   // Photo before collection
  proofAfter?: string;    // Photo after collection
}
```

#### Issue Management System
```typescript
interface Issue {
  id: string;
  workerId: string;
  title: string;
  description: string;
  category: string;
  timestamp: string;
  photo?: string;
}
```

## 📊 Mock Data & Demo Content

### Worker Database (5 Active Workers)
- **Rajesh Kumar** (SW-101) - Team A, Sector A - 132 collections, 1320 points
- **Priya Sharma** (SW-102) - Team B, Sector B - 128 collections, 1280 points
- **Amit Singh** (SW-103) - Team A, Sector C - 145 collections, 1450 points (Top Performer)
- **Sunita Devi** (SW-104) - Team B, Sector D
- **Vikram Yadav** (SW-105) - Team C, Sector E

### Performance Metrics
- **Weekly Collections**: 117 total tasks across 7 days
- **Total Waste Collected**: 948 kg
- **Peak Performance Day**: Saturday (22 collections, 180kg)
- **Average Daily Collections**: 16.7 tasks
- **Top Performer**: Amit Singh with 145 collections

### Collection Routes & GPS Coordinates
- **Route 1: Sector A Collection** (Delhi NCR coordinates)
- **Green Park Main Gate**: 28.5494°N, 77.2066°E ✅ Completed (25kg)
- **Community Center Block A**: 28.5504°N, 77.2076°E ✅ Completed (18kg)
- **Market Complex**: 28.5524°N, 77.2096°E ⏳ Pending
- **Residential Area Phase 1**: 28.5534°N, 77.2106°E ⏳ Pending
- **School Compound**: 28.5544°N, 77.2116°E ⏳ Pending

### Training Resources
- **4 Training Videos** with external CDN hosting
- **Total Duration**: 30+ minutes of educational content
- **Categories**: Safety (50%), Efficiency (25%), Emergency (25%)
- **Hosted on**: Cloudinary video platform

## 🔐 Authentication & Security

### Login System
- **Demo Credentials**: 
  - Worker 1: `SW-101` / `password123`
  - Worker 2: `SW-102` / `password123`
  - Worker 3: `SW-103` / `password123`
- **Session Management**: Local storage with persistent login
- **Role-Based Access**: Protected routes for authenticated users only

### Data Security
- GPS data with timestamp verification
- Photo evidence with location stamps
- Secure user authentication
- Protected API endpoints (when implemented)

## 💰 Wage & Incentive System

### How It Ensures Fair Compensation

#### 1. **100% Transparent Work Verification**
```
Photo Evidence Chain:
├── Before Collection (GPS + Timestamp)
├── During Collection (Weight Verification)
├── After Collection (GPS + Timestamp)
└── Automatic Report Generation
```

#### 2. **Performance-Based Rewards**
- **Green Coins System**: Digital currency for achievements
- **Monthly Targets**: 100 collections goal with progress tracking
- **Weight Targets**: 800kg monthly collection goals
- **Bonus Structure**: ₹1,200+ monthly earning potential

#### 3. **Career Advancement Tracking**
- **Skill Development**: Training completion certificates
- **Safety Compliance**: Health checkup and equipment usage
- **Leadership Potential**: Team ranking and peer recognition
- **Consistency Rewards**: Streak tracking and attendance bonuses

## 🎯 Benefits & Impact

### For Sanitation Workers:
- ✅ **Fair Wage Distribution** based on verified actual work
- ✅ **Clear Career Path** with skill-based advancement
- ✅ **Safety & Training** with comprehensive resources
- ✅ **Recognition System** with achievements and rankings
- ✅ **Digital Documentation** for dispute resolution

### For Municipal Authorities:
- ✅ **Complete Operational Visibility** with real-time tracking
- ✅ **Data-Driven Decisions** with analytics and reporting
- ✅ **Automated Compliance** with photo verification
- ✅ **Cost Optimization** through route and resource planning
- ✅ **Quality Assurance** with systematic monitoring

### For Citizens:
- ✅ **Improved Service Quality** with consistent collection
- ✅ **Cleaner Neighborhoods** through efficient operations
- ✅ **Transparent Municipal Operations** with accountability
- ✅ **Quick Issue Resolution** through direct reporting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser with camera access
- GPS/location services enabled

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd project-shawchh-sarthi

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Demo Access
1. Navigate to the login page
2. Use demo credentials: `SW-101` / `password123`
3. Explore the dashboard and features
4. Test camera functionality for task completion
5. View performance analytics and training modules

## 📱 Core User Flows

### 1. Daily Work Flow
```
Login → Dashboard → View Route → Navigate to Location → 
Capture Before Photo → Complete Collection → Capture After Photo → 
Weight Recording → Task Marked Complete → Performance Updated
```

### 2. Issue Reporting Flow
```
Report Issue → Select Category → Add Description → 
Upload Photo (Optional) → Submit → Receive Tracking ID → 
Authority Notification → Resolution Tracking
```

### 3. Training Flow
```
Access Training → Browse Categories → Select Video → 
Complete Module → Progress Tracking → Skill Certification
```

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Green-to-blue gradient representing cleanliness and trust
- **Typography**: Clean, readable fonts optimized for mobile devices
- **Icons**: Consistent Lucide React icon library
- **Responsive**: Mobile-first design with tablet and desktop optimization

### Interactive Elements
- **Camera Integration**: Native browser camera access for photo capture
- **GPS Integration**: Real-time location tracking and mapping
- **Progress Animations**: Visual feedback for task completion
- **Chart Visualization**: Interactive performance analytics
- **Modal Systems**: Video player and form overlays

## 🔄 Future Enhancements

### Phase 1 (Current)
- ✅ Core worker dashboard
- ✅ Task tracking with photo verification
- ✅ Performance analytics
- ✅ Training modules
- ✅ Issue reporting system

### Phase 2 (Planned)
- 🔄 Supervisor dashboard for team management
- 🔄 Real-time notifications and alerts
- 🔄 Advanced route optimization with AI
- 🔄 Integration with municipal ERP systems
- 🔄 Multi-language support (Hindi, English, local languages)

### Phase 3 (Future)
- 🔄 Citizen complaint integration
- 🔄 IoT sensor integration for smart bins
- 🔄 Blockchain verification for transparency
- 🔄 Machine learning for predictive maintenance
- 🔄 Advanced analytics and business intelligence

## 📞 Support & Documentation

### Technical Support
- **Development Issues**: Check browser console for errors
- **Camera Access**: Ensure HTTPS and permission grants
- **GPS Issues**: Verify location services are enabled
- **Performance**: Use modern browsers (Chrome, Firefox, Safari)

### Training Resources
- Video tutorials embedded in the platform
- Safety guidelines reference documentation
- Emergency contact information
- User manual and FAQ section

## 🏆 Recognition & Awards

This platform represents a significant step toward:
- **Digital India Initiative** compliance
- **Swachh Bharat Mission** technology support
- **UN Sustainable Development Goals** alignment
- **Smart City** infrastructure development

## 📄 License & Credits

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Copyright (c) 2025 Sumit Chaubey and Vishnu Jaiswal**

### Technology Credits
- React.js ecosystem for robust frontend development
- Leaflet for interactive mapping capabilities
- Recharts for data visualization
- Tailwind CSS for responsive design
- Cloudinary for media hosting
- ImageKit for image optimization

### Image & Media Sources
- Pexels for stock photography
- Cloudinary for video hosting
- Custom photography for proof-of-work images
- Icon library from Lucide React

---

**Swachh Seva** - Empowering sanitation workers through technology for a cleaner, more transparent future. 🌱

*Last Updated: September 29, 2025*#   w a s t e - m a n a g e m e n t  
 #   w a s t e - m a n a g e m e n t  
 