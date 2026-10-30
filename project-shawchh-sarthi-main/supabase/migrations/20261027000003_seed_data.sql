-- ====================================================================
-- SWACHH SEVA - DATABASE SEED DATA
-- Migration: 20261027000003_seed_data.sql
-- Description: Populates initial municipal master data:
--   - Training modules (Safety, Efficiency, Emergency)
--   - Area Cleanliness records (Sectors A-E)
--   - Initial collection tasks
--   - Sample citizen grievances
-- ====================================================================

-- 1. Seed Training Resources
INSERT INTO public.training_resources (
    id,
    title,
    description,
    content_url,
    duration,
    thumbnail_url,
    category,
    publication_status
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'Proper Waste Segregation Techniques',
    'Learn the fundamentals of waste segregation and proper handling techniques for hazardous and wet waste.',
    'https://collection.cloudinary.com/dmfmgutg6/5c879f00d54e4262b0e7a3de43d7bb77',
    '1:32',
    'https://vincular.in/wp-content/uploads/2023/11/Know-your-waste.png',
    'Safety',
    'published'
),
(
    '22222222-2222-2222-2222-222222222222',
    'Personal Safety Equipment Usage',
    'Complete guide to using safety equipment, reflective gear, and puncture-resistant gloves correctly.',
    'https://collection.cloudinary.com/dmfmgutg6/3b3885078f957018c3109d37b5e64180',
    '6:15',
    'https://uppler-platform-otego.s3.eu-west-3.amazonaws.com/uppler_default/98/af/985ab1c83bc8374a1ef0f16cd62d.webp',
    'Safety',
    'published'
),
(
    '33333333-3333-3333-3333-333333333333',
    'Efficient Route Planning',
    'Optimize your daily collection routes for maximum fuel and time efficiency across assigned municipal sectors.',
    'https://collection.cloudinary.com/dmfmgutg6/4dea0c1f9aa3b1e38f8004dbacb80769',
    '12:45',
    'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=300',
    'Efficiency',
    'published'
),
(
    '44444444-4444-4444-4444-444444444444',
    'Emergency Response Procedures',
    'What to do in case of chemical spills, needle-stick injuries, or accidents during waste collection.',
    'https://collection.cloudinary.com/dmfmgutg6/e7f56851e3e869b3f36b5a4d821aec3f',
    '10:20',
    'https://as2.ftcdn.net/jpg/02/23/61/03/1000_F_223610323_kbLysI0UTi9lhyu1kEIUpAFf8YOgXki7.jpg',
    'Emergency',
    'published'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content_url = EXCLUDED.content_url;

-- 2. Seed Area Cleanliness Records
INSERT INTO public.area_cleanliness (
    id,
    name,
    zone,
    ward,
    cleanliness_score,
    status,
    last_cleaned_time,
    lat,
    lng,
    proof_before_url,
    proof_after_url,
    verified_by_citizen_count,
    total_reports,
    next_scheduled_collection,
    waste_types_collected
) VALUES 
(
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Green Park Main Gate & Sector A',
    'Sector A',
    'Ward 14',
    95,
    'clean',
    NOW() - INTERVAL '3 hours',
    28.5494,
    77.2066,
    'https://ik.imagekit.io/sihhackstone/greater_noida_door_to_door_waste-collection_1631556299135_1631556299453.jpeg',
    'https://ik.imagekit.io/sihhackstone/unnamed.png',
    42,
    1,
    'Tomorrow 07:30 AM',
    ARRAY['Dry Waste', 'Wet Waste', 'Plastic Bins']
),
(
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Community Center & Block A Market',
    'Sector A',
    'Ward 14',
    91,
    'clean',
    NOW() - INTERVAL '2 hours',
    28.5504,
    77.2076,
    'https://ik.imagekit.io/sihhackstone/Gemini_Genevr2063vr2.png?updatedAt=1758101678699',
    'https://ik.imagekit.io/sihhackstone/Gem256.png?updatedAt=1758102184684',
    29,
    0,
    'Tomorrow 08:15 AM',
    ARRAY['Commercial Waste', 'Cardboard', 'Organic']
),
(
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'Sector B Central Market & Plaza',
    'Sector B',
    'Ward 18',
    82,
    'in-progress',
    NOW() - INTERVAL '1 day',
    28.5524,
    77.2096,
    'https://ik.imagekit.io/sihhackstone/greater_noida_door_to_door_waste-collection_1631556299135_1631556299453.jpeg',
    NULL,
    16,
    2,
    'Today 02:30 PM (In-Transit)',
    ARRAY['Market Waste', 'Dry Waste']
),
(
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'Sector C Residential Complex Phase 2',
    'Sector C',
    'Ward 22',
    68,
    'needs-attention',
    NOW() - INTERVAL '1 day',
    28.5534,
    77.2106,
    NULL,
    NULL,
    8,
    3,
    'Today 03:00 PM (Priority)',
    ARRAY['Household Garbage', 'Bio-degradable']
),
(
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'Sector D School & Playground Perimeter',
    'Sector D',
    'Ward 25',
    88,
    'clean',
    NOW() - INTERVAL '5 hours',
    28.5544,
    77.2116,
    'https://ik.imagekit.io/sihhackstone/greater_noida_door_to_door_waste-collection_1631556299135_1631556299453.jpeg',
    'https://ik.imagekit.io/sihhackstone/Gem256.png?updatedAt=1758102184684',
    35,
    0,
    'Tomorrow 07:00 AM',
    ARRAY['Paper/Stationery Waste', 'Dry Waste']
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    cleanliness_score = EXCLUDED.cleanliness_score,
    status = EXCLUDED.status;

-- 3. Seed Waste Collection Tasks
INSERT INTO public.waste_collection_tasks (
    id,
    route_name,
    location,
    zone,
    lat,
    lng,
    waste_category,
    scheduled_date,
    status,
    weight_kg,
    proof_before_url,
    proof_after_url
) VALUES 
(
    '99999999-9999-9999-9999-999999999901',
    'Route 1: Sector A Collection',
    'Green Park Main Gate',
    'Sector A',
    28.5494,
    77.2066,
    ARRAY['Dry Waste', 'Wet Waste'],
    CURRENT_DATE,
    'completed',
    25.0,
    'https://ik.imagekit.io/sihhackstone/greater_noida_door_to_door_waste-collection_1631556299135_1631556299453.jpeg',
    'https://ik.imagekit.io/sihhackstone/unnamed.png'
),
(
    '99999999-9999-9999-9999-999999999902',
    'Route 1: Sector A Collection',
    'Community Center Block A',
    'Sector A',
    28.5504,
    77.2076,
    ARRAY['Dry Waste', 'Commercial Waste'],
    CURRENT_DATE,
    'completed',
    18.0,
    'https://ik.imagekit.io/sihhackstone/Gemini_Genevr2063vr2.png?updatedAt=1758101678699',
    'https://ik.imagekit.io/sihhackstone/Gem256.png?updatedAt=1758102184684'
),
(
    '99999999-9999-9999-9999-999999999903',
    'Route 1: Sector A Collection',
    'Market Complex',
    'Sector A',
    28.5524,
    77.2096,
    ARRAY['Commercial Waste', 'Cardboard'],
    CURRENT_DATE,
    'pending',
    0.0,
    NULL,
    NULL
),
(
    '99999999-9999-9999-9999-999999999904',
    'Route 1: Sector A Collection',
    'Residential Area Phase 1',
    'Sector A',
    28.5534,
    77.2106,
    ARRAY['Household Garbage'],
    CURRENT_DATE,
    'pending',
    0.0,
    NULL,
    NULL
),
(
    '99999999-9999-9999-9999-999999999905',
    'Route 1: Sector A Collection',
    'School Compound',
    'Sector A',
    28.5544,
    77.2116,
    ARRAY['Paper Waste', 'Dry Waste'],
    CURRENT_DATE,
    'pending',
    0.0,
    NULL,
    NULL
)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Initial Citizen Grievances
INSERT INTO public.citizen_complaints (
    id,
    citizen_name,
    citizen_mobile,
    category,
    description,
    location,
    zone,
    image_url,
    status,
    resolved_image_url,
    resolution_notes
) VALUES 
(
    'CR-1001',
    'Pooja Verma',
    '+91-9876500001',
    'overflowing-bin',
    'Community dustbin overflowing with garden cuttings and kitchen waste since yesterday evening.',
    'Sector A, Behind Community Center Park',
    'Sector A',
    'https://ik.imagekit.io/sihhackstone/greater_noida_door_to_door_waste-collection_1631556299135_1631556299453.jpeg',
    'resolved',
    'https://ik.imagekit.io/sihhackstone/unnamed.png',
    'Collected and sanitized bin at 09:30 AM by Sector A route crew.'
),
(
    'CR-1002',
    'Ramesh Patel',
    '+91-9876500002',
    'garbage-dump',
    'Illegal dumping of plastic packaging bags beside the vegetable stalls blocking walking pathway.',
    'Sector B Market lane near ATM',
    'Sector B',
    'https://ik.imagekit.io/sihhackstone/Gemini_Genevr2063vr2.png?updatedAt=1758101678699',
    'in-progress',
    NULL,
    'Dispatched secondary cleanup vehicle DL-1WA-204.'
),
(
    'CR-1003',
    'Ananya Deshmukh',
    '+91-9876500003',
    'missed-pickup',
    'Morning door-to-door waste vehicle missed Block 3 residential row today.',
    'Sector C, Main Gate of Block 3',
    'Sector C',
    NULL,
    'pending',
    NULL,
    NULL
)
ON CONFLICT (id) DO NOTHING;
