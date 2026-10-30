# Swachh Seva - Smart Municipal Solid Waste Management Platform

[![Node.js Version](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.5-blueviolet.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E.svg)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 1. Project Overview

**Swachh Seva** (*"Clean Service"*) is a full-stack municipal solid waste management and civic accountability platform built for Indian urban local bodies and municipal corporations.

The application connects three essential stakeholders into a unified operational workflow:
1. **Citizens**: File geo-tagged waste grievances, upload photographic evidence, track complaint resolution status with before/after photos, and vote on neighborhood cleanliness scorecard ratings.
2. **Sanitation Workers**: View scheduled daily collection routes, record waste tonnage weights, capture before-and-after photo verification proofs with camera overlays, and log immutable collection records.
3. **Municipal Authorities**: Command center dashboard displaying real-time citywide cleanliness metrics, collection tasks management (creation, scheduling, cancellation), citizen grievance redressal with staff dispatch, and photographic wage incentive auditing.

---

## 🚀 2. Core Implemented Features

### 👤 For Citizens
- **Cleanliness Grievance Redressal**: File complaints categorized by issue type (`overflowing-bin`, `garbage-dump`, `blocked-drain`, `missed-pickup`, `other`) with descriptions, sector zone, and photographic evidence.
- **Evidence Storage**: Images uploaded directly to Supabase Storage bucket (`waste-evidence`).
- **Grievance Tracking**: View personal reported issues with real-time status tags (`pending`, `in-progress`, `resolved`), assigned worker details, and official municipal resolution notes accompanied by cleaned proof photos.
- **Neighborhood Cleanliness Scorecard**: View sector/ward cleanliness ratings and submit civic cleanliness votes.
- **Duplicate Prevention**: Buttons lock and display loading indicators during submission to prevent duplicate reports.

### 👷 For Sanitation Workers
- **Assigned Route Stops**: View daily scheduled collection route points filtered by assigned worker ID or unassigned pool tasks.
- **Two-Step Verification**:
  - *Start Collection*: Transition task to `in-progress` with camera photo proof.
  - *Complete Collection*: Transition task to `completed` with collected waste weight (kg) and after-collection photo proof.
- **Immutable Audit Logging**: Completing a task writes an immutable audit record to `collection_records`.
- **Performance & Incentives**: View personal weekly collection charts, daily tonnage trends, incentive wage calculations, and sanitation team leaderboard standings.

### 🏛️ For Municipal Authorities
- **Executive Command Dashboard**: Real-time aggregated statistics calculated from database tables (Cleanliness Index, Waste Lifted, Registered Workforce on duty, and Pending Citizen Grievances).
- **Collection Task Management**: Schedule new collection tasks via an interactive modal with geographic coordinates, route name, sector, and assigned worker; cancel or update task statuses.
- **Workforce Roster**: View registered field staff queried from the `profiles` table with contact numbers, health checkup status, and assigned sector zones.
- **Grievance Triage & Assignment**: View all sector complaints, dispatch emergency cleanup units, or assign complaints directly to registered field workers from a dropdown roster.
- **Wage Incentive Audit**: Inspect GPS/field before-and-after photos, verify tonnage weights, and approve or flag worker wage bonuses with database persistence.
- **Training Hub Management**: Publish new video modules (title, category, duration, streaming URL, thumbnail, learning outcomes) and manage the workforce library with delete permissions.

---

## 🛠️ 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18.3.1 | Component-based interactive UI |
| **Language** | TypeScript 5.5.3 | Static type safety and strict schema alignment |
| **Bundler & Dev Server** | Vite 7.1.5 | Ultra-fast HMR and optimized production builds |
| **Styling** | Tailwind CSS 3.4.1 | Responsive, utility-first design system |
| **Routing** | React Router DOM 7.9.1 | Declarative role-protected routing |
| **Icons** | Lucide React 0.344.0 | Modern iconography |
| **Visual Charts** | Recharts 3.2.0 | Responsive SVG performance and weight graphs |
| **Mapping Engine** | Leaflet 1.9.4 | Location-based marker mapping with coordinate validation |
| **Backend & Database** | Supabase (PostgreSQL 15) | Relational database, Auth, RLS, Storage, RPC functions |

---

## 🏗️ 4. Application Architecture

```
                                  [ Browser / Client ]
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
                [ Public Routes ]                     [ Protected Routes ]
              • /login                              (Wrapped in ProtectedRoute)
              • /signup                             • /citizen      -> Citizen, Authority
                                                    • /dashboard    -> Worker, Authority
                                                    • /performance  -> Worker, Authority
                                                    • /training     -> Worker, Authority
                                                    • /authority    -> Authority STRICT
                                                    • /report       -> Authenticated Users
                                                    • /profile      -> Authenticated Users
                                           │
                                           ▼
                                 [ AuthContext & State ]
                     • Session lifecycle & profile synchronization
                     • Role resolution from public.profiles
                                           │
                                           ▼
                             [ Service Layer Abstraction ]
       ┌───────────────┬───────────────┼───────────────┬───────────────┐
       ▼               ▼               ▼               ▼               ▼
[ authService ] [ taskService ] [ complaintService ] [ statsService ] [ storageService ]
       │               │               │               │               │
       └───────────────┴───────────────┼───────────────┴───────────────┘
                                       ▼
                       [ Supabase Client (supabase-js) ]
                      • Reads from import.meta.env
                      • Graceful mock fallback if unconfigured
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
          [ Supabase Auth ]                      [ PostgreSQL Database ]
        • JWT Session tokens                    • Row Level Security (RLS)
        • Email / Password                      • 7 relational tables
                                                • Storage: 'waste-evidence'
```

---

## 🔐 5. User Roles & Security Matrix

### Role Permissions

| Action / Route | Citizen | Worker | Municipal Authority |
|---|:---:|:---:|:---:|
| Public Sign Up (`/signup`) | ✅ | ✅ | ❌ *(Privilege Guard)* |
| Citizen Portal (`/citizen`) | ✅ | ❌ | ✅ *(Oversight)* |
| Submit Waste Complaint | ✅ | ✅ | ✅ |
| View Own Complaints | ✅ | ❌ | ✅ |
| View Assigned Tasks (`/dashboard`) | ❌ | ✅ | ✅ |
| Complete Task & Log Record | ❌ | ✅ | ❌ |
| Performance Charts (`/performance`) | ❌ | ✅ *(Personal)* | ✅ *(Citywide)* |
| Browse Training Modules (`/training`) | ❌ | ✅ *(Read-only)* | ✅ *(Manage/Publish/Delete)* |
| Authority Desk (`/authority`) | ❌ | ❌ | ✅ *(Strict)* |
| Schedule / Delete Tasks | ❌ | ❌ | ✅ |
| Assign Worker to Grievance | ❌ | ❌ | ✅ |
| Authorize Wage Incentives | ❌ | ❌ | ✅ |
| Edit Personal Profile (`/profile`) | ✅ *(Self)* | ✅ *(Self)* | ✅ *(Self)* |
| Change User Role | ❌ | ❌ | ❌ *(Database RLS Guard)* |

### Security Measures Implemented
1. **Public Privilege Escalation Guard**: Registration strictly permits only `citizen` or `worker` roles. Attempts to select or register as `authority` are rejected both on the client and in database RLS triggers.
2. **Zero-Trust Row Level Security (RLS)**:
   - `profiles`: Users can only update their own contact details. The `WITH CHECK (role = current_role)` condition blocks unauthorized role escalation at the PostgreSQL engine level.
   - `citizen_complaints`: Citizens can only query complaints belonging to their user ID (`citizen_id = auth.uid()`).
   - `waste_collection_tasks`: Workers can only view tasks assigned to them or unassigned pool tasks in their zone.
   - `collection_records`: Workers can insert immutable completion logs; modifications are restricted.
3. **No Service Role Keys in Frontend**: Only the public anon key (`VITE_SUPABASE_ANON_KEY`) is used in the browser. Database access is governed exclusively by user JWTs and RLS policies.
4. **Coordinate Bounds Checking**: All coordinates rendered on the map are validated against numeric boundaries (`-90 <= lat <= 90` and `-180 <= lng <= 180`) to prevent Leaflet container crashes.

---

## 🗄️ 6. Database Setup & Supabase Migrations

The database schema and security policies are organized into 4 sequential SQL migrations located in `supabase/migrations/`:

### Migration Files
1. `20261027000001_initial_schema.sql`:
   - Creates ENUM types: `user_role`, `task_status`, `complaint_status`, `cleanliness_status`, `audit_status`.
   - Creates tables: `profiles`, `waste_collection_tasks`, `citizen_complaints`, `collection_records`, `training_resources`, `area_cleanliness`, `worker_audits`.
   - Sets up `on_auth_user_created` trigger to automatically initialize a profile row upon registration.
2. `20261027000002_security_rls_policies.sql`:
   - Enables RLS on all tables.
   - Creates helper functions: `current_user_role()`, `is_authority()`, `is_worker()`, `is_citizen()`.
   - Applies granular policies for SELECT, INSERT, UPDATE, and DELETE across all roles.
3. `20261027000003_seed_data.sql`:
   - Seeds baseline sector zones, areas, routes, and sample curriculum modules.
4. `20261027000004_storage_and_stats.sql`:
   - Creates the `waste-evidence` public storage bucket.
   - Sets up storage RLS policies allowing authenticated users to upload photos and public reads for verified evidence photos.

---

## ⚙️ 7. Environment Variables

Create a `.env` file in the project directory (`project-shawchh-sarthi-main/`):

```bash
# Copy template
cp .env.example .env
```

Set your Supabase project parameters:

```env
# [Required] Your Supabase Project URL
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# [Required] Your Supabase Anon Public Key
# Found in: Supabase Dashboard -> Project Settings -> API -> Project API keys -> anon/public
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> [!NOTE]
> When `VITE_SUPABASE_URL` is omitted or left as placeholder, the application runs in **Graceful Development Fallback Mode**, allowing full UI preview without breaking. Once real credentials are supplied, all operations automatically execute against live Supabase PostgreSQL tables and Storage buckets.

---

## 🚀 8. Local Installation & Development Commands

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher

### Step-by-Step Setup

1. **Navigate to the active project folder**:
   ```bash
   cd waste-management-main/project-shawchh-sarthi-main
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:5173`.

5. **Run Linting**:
   ```bash
   npm run lint
   ```
   Verifies code quality with ESLint and TypeScript rules (0 errors).

6. **Run Test Suites**:
   ```bash
   # Run full application workflow & security tests
   npm test

   # Run auth-specific tests
   npm run test:auth
   ```

7. **Production Build**:
   ```bash
   npm run build
   ```
   Generates optimized static assets in the `dist/` directory.

8. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 🛡️ 9. How to Provision an Authorized Municipal Officer Account

Because public registration blocks users from signing up as municipal authorities, an authority account must be securely provisioned via one of the following methods:

### Method A: Via Supabase SQL Editor (Recommended)
1. In the Supabase Dashboard, create a user in **Authentication -> Users** (or have the officer sign up publicly as a citizen).
2. Go to **SQL Editor** and run:
   ```sql
   UPDATE public.profiles
   SET 
     role = 'authority',
     designation = 'Zonal Sanitary Officer',
     zone = 'Zone 1 (All Sectors)'
   WHERE email = 'officer.email@municipality.gov.in';
   ```
3. The officer can now log in at `/login` and will be automatically routed to `/authority`.

---

## ⚠️ 10. Accurate Feature Scope & Known Limitations

To maintain engineering integrity, the following outlines what is genuinely implemented versus what requires external infrastructure:

- **Location-Based Mapping (Implemented)**: Tasks and collection stops render on an interactive OpenStreetMap via Leaflet using stored geographic coordinates (`lat`/`lng`).
  - *Limitation*: This is **stored location-based route mapping**, not real-time live GPS satellite tracking of moving vehicles (which would require in-vehicle GPS hardware and WebSocket telemetry).
- **Photo Evidence Overlay (Implemented)**: Workers can capture photos with timestamp and GPS coordinate overlays rendered onto an HTML5 canvas.
  - *Limitation*: Before/after compliance is checked against supervisor review and database audit logs, not an automated computer-vision AI model.
- **In-App Alerts (Implemented)**: Success banners, error alerts, and status badges provide instant UI feedback.
  - *Limitation*: External SMS gateways (e.g. Twilio) or push notification servers (e.g. Firebase Cloud Messaging) are not connected; notifications occur within the web application.

---

## 📄 11. License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.