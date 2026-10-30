# Swachh Seva - Supabase Database & Security Guide

This directory contains the PostgreSQL schema definitions, Row Level Security (RLS) policies, and seed migrations for the **Swachh Seva Municipal Waste Management Platform**.

---

## 📁 Migration Structure

| Migration File | Description |
|---|---|
| [`20261027000001_initial_schema.sql`](./migrations/20261027000001_initial_schema.sql) | Core entities: `profiles`, `waste_collection_tasks`, `citizen_complaints`, `collection_records`, `training_resources`, `area_cleanliness`, `worker_audits`, enums, indexes, and triggers (`handle_new_auth_user`, `handle_updated_at`). |
| [`20261027000002_security_rls_policies.sql`](./migrations/20261027000002_security_rls_policies.sql) | Comprehensive Row Level Security (RLS) policies enforcing role-based isolation (`citizen`, `worker`, `authority`). |
| [`20261027000003_seed_data.sql`](./migrations/20261027000003_seed_data.sql) | Initial seed datasets for training modules, municipal areas, route tasks, and grievance samples. |

---

## 🚀 How to Apply Migrations to Your Supabase Project

### Option A: Using the Supabase Web Dashboard (Easiest)

1. Log in to [Supabase](https://supabase.com) and create or open your project.
2. In the left sidebar, click **SQL Editor**.
3. Create a **New query**.
4. Copy and paste the contents of [`migrations/20261027000001_initial_schema.sql`](./migrations/20261027000001_initial_schema.sql) and click **Run**.
5. Create a new query, paste the contents of [`migrations/20261027000002_security_rls_policies.sql`](./migrations/20261027000002_security_rls_policies.sql) and click **Run**.
6. (Optional) Run [`migrations/20261027000003_seed_data.sql`](./migrations/20261027000003_seed_data.sql) to populate initial sample areas, training videos, and route tasks.

### Option B: Using the Supabase CLI

```bash
# 1. Login to Supabase CLI
npx supabase login

# 2. Link your local project to your remote Supabase project
npx supabase link --project-ref your-project-ref

# 3. Push migrations to remote database
npx supabase db push
```

---

## 🔒 Security Architecture: Zero-Trust Row Level Security

| Role | Access Permissions |
|---|---|
| **Citizen (`citizen`)** | - View and edit only their own profile.<br>- Submit new complaints/grievances and edit them only while `status = 'pending'`.<br>- View community area cleanliness scores and participate in verification votes via `vote_area_cleanliness()`.<br>- Cannot modify or delete other citizens' private records or worker records. |
| **Sanitation Worker (`worker`)** | - View their assigned daily tasks and route stops.<br>- Submit collection records, update task progress, upload verification photos (`proofBefore`, `proofAfter`), and record waste weight.<br>- View published training modules.<br>- View their own performance audits and incentive calculations.<br>- Cannot modify municipal policy, reassign tasks, or audit other workers. |
| **Municipal Authority (`authority`)** | - Full administrative oversight across all zones and wards.<br>- Create and assign collection tasks to sanitation workers.<br>- Review, approve, or flag worker audits and calculate wage incentives.<br>- Review citizen complaints and dispatch rapid response cleanup vehicles.<br>- Manage training resources and area cleanliness benchmarks. |

---

## 🔑 Environment Variables Setup

Create a `.env` file in the project root with the following keys from your Supabase Dashboard (**Project Settings** ➔ **API**):

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

> **Warning:** NEVER expose your Supabase `service_role` key in frontend code or in the `.env` file used by Vite. The `anon` key combined with PostgreSQL Row Level Security (RLS) protects all data.
