-- ============================================
-- Gramin Saathi — Supabase Database Schema
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ============================================

-- 1. BLOGS TABLE
create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  image_url text,
  category text default 'General',
  author text default 'Gramin Saathi Team',
  published boolean default true,
  created_at timestamp with time zone default now()
);

-- 2. CONTACT MESSAGES TABLE
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- 3. TESTIMONIALS TABLE
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  farmer_name text not null,
  location text,
  message text not null,
  photo_url text,
  approved boolean default false,
  created_at timestamp with time zone default now()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

alter table blogs enable row level security;
alter table messages enable row level security;
alter table testimonials enable row level security;

-- Public can READ only published blogs
create policy "Public can view published blogs"
on blogs for select
using (published = true);

-- Public can READ only approved testimonials
create policy "Public can view approved testimonials"
on testimonials for select
using (approved = true);

-- Public can INSERT a new testimonial (goes in as unapproved)
create policy "Public can submit testimonials"
on testimonials for insert
with check (true);

-- Public can INSERT a contact message
create policy "Public can submit messages"
on messages for insert
with check (true);

-- Logged-in admin (any authenticated user) can do EVERYTHING
-- (Since this is a small single-admin site, any authenticated user = admin)
create policy "Authenticated users manage blogs"
on blogs for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Authenticated users manage messages"
on messages for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy "Authenticated users manage testimonials"
on testimonials for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- ============================================
-- SAMPLE DATA (optional — delete if not needed)
-- ============================================
insert into blogs (title, slug, excerpt, content, category, image_url)
values
('Top Organic Farming Tips For Indian Farmers', 'top-organic-farming-tips',
 'Simple, low-cost organic techniques that improve soil health and yield.',
 'Organic farming does not need expensive inputs. Start with composting kitchen and farm waste, rotate your crops every season, and use neem-based sprays instead of chemical pesticides. Over time your soil becomes richer and your input costs go down.',
 'Organic Farming', 'images/h2news1.jpg'),
('Government Schemes Every Farmer Should Know', 'government-schemes-every-farmer-should-know',
 'A quick guide to PM Kisan, KCC, PMFBY and more.',
 'The Indian government runs several schemes to support farmers financially and technically — PM Kisan Samman Nidhi for income support, Kisan Credit Card for low-interest loans, and PMFBY for crop insurance. Visit your local agriculture office or our Government Schemes page to apply.',
 'Government Schemes', 'images/h2news3.jpg')
on conflict (slug) do nothing;
