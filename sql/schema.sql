-- ============================================
-- Gramin Saathi - Supabase Database Schema (secure version)
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- Pehle neeche "ADMIN EMAIL" wali line me apna admin email badal do!
-- ============================================

-- 1. BLOGS
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

-- 2. CONTACT MESSAGES
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 100),
  email text not null check (char_length(email) <= 150),
  phone text check (phone is null or char_length(phone) <= 20),
  subject text check (subject is null or char_length(subject) <= 150),
  message text not null check (char_length(message) <= 3000),
  is_read boolean default false,
  created_at timestamp with time zone default now()
);

-- 3. TESTIMONIALS
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  farmer_name text not null check (char_length(farmer_name) <= 100),
  location text check (location is null or char_length(location) <= 100),
  message text not null check (char_length(message) <= 1500),
  photo_url text,
  approved boolean default false,
  created_at timestamp with time zone default now()
);

-- 4. ADMINS (sirf yahi emails admin panel use kar sakte hain)
create table if not exists admins (
  email text primary key
);

-- !!! ADMIN EMAIL: yaha apna wahi email likho jo Supabase Authentication -> Users me banaya hai !!!
insert into admins (email) values ('REPLACE_WITH_YOUR_ADMIN_EMAIL')
on conflict do nothing;

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from admins where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
alter table blogs enable row level security;
alter table messages enable row level security;
alter table testimonials enable row level security;
alter table admins enable row level security;   -- koi policy nahi = public koi access nahi

-- Public: sirf published blogs padh sakta hai
drop policy if exists "Public can view published blogs" on blogs;
create policy "Public can view published blogs" on blogs for select using (published = true);

-- Public: sirf approved testimonials padh sakta hai
drop policy if exists "Public can view approved testimonials" on testimonials;
create policy "Public can view approved testimonials" on testimonials for select using (approved = true);

-- Public: testimonial bhej sakta hai, par hamesha unapproved
drop policy if exists "Public can submit testimonials" on testimonials;
create policy "Public can submit testimonials" on testimonials for insert
  with check (approved = false);

-- Public: contact message bhej sakta hai, par padh nahi sakta
drop policy if exists "Public can submit messages" on messages;
create policy "Public can submit messages" on messages for insert
  with check (is_read = false);

-- Admin: sab kuch (sirf admins table wale email)
drop policy if exists "Authenticated users manage blogs" on blogs;
drop policy if exists "Authenticated users manage messages" on messages;
drop policy if exists "Authenticated users manage testimonials" on testimonials;
drop policy if exists "Admins manage blogs" on blogs;
drop policy if exists "Admins manage messages" on messages;
drop policy if exists "Admins manage testimonials" on testimonials;
create policy "Admins manage blogs" on blogs for all using (is_admin()) with check (is_admin());
create policy "Admins manage messages" on messages for all using (is_admin()) with check (is_admin());
create policy "Admins manage testimonials" on testimonials for all using (is_admin()) with check (is_admin());

-- ============================================
-- SAMPLE BLOGS (optional - chaho to delete kar sakte ho)
-- ============================================
insert into blogs (title, slug, excerpt, content, category, image_url)
values
('Top Organic Farming Tips For Indian Farmers', 'top-organic-farming-tips', 'Kam kharch me mitti ki sehat sudharne ke aasaan organic tareeke.', 'Organic kheti ke liye mehenge inputs ki zaroorat nahi hoti. Sahi tareeke se shuru karein to 2-3 saal me mitti ki sehat aur munafa dono badhte hain.

1. Compost banayein: Ghar aur khet ke kachre (patte, bhusa, gobar) se compost ya vermicompost taiyaar karein. Isse rasayanik khaad ka kharch kam hota hai.
2. Fasal chakra (crop rotation) apnayein: Har season me ek hi fasal na ugayein. Daalon ke baad anaaj lagane se mitti me nitrogen waapas aata hai.
3. Neem aadhaarit spray: Keet niyantran ke liye neem ka tel ya neem ki khali ka istemal karein, rasayanik keetnashak ki jagah.
4. Mulching: Khet me paraali ya sookhe patte bichhane se nami bachti hai aur kharpatvaar kam ugte hain.
5. Mitti ki jaanch: Soil Health Card ke zariye apni mitti ki jaanch karwayein aur usi ke hisaab se khaad daalein.

Chhoti jagah se shuru karein, natije dekhein, phir dheere dheere poore khet me badhayein.', 'Organic Farming', 'images/h2news1.jpg'),
('Government Schemes Every Farmer Should Know', 'government-schemes-every-farmer-should-know', 'PM Kisan, KCC, PMFBY aur doosri schemes ki seedhi jaankari.', 'Sarkar kisaano ke liye kai yojanaein chalati hai. Yeh sabse zyada kaam aane wali hain:

PM-KISAN: Chhote aur seemaant kisaan parivaaron ko saal me 6,000 rupaye, 2,000 rupaye ki teen kiston me, seedhe bank khaate me milte hain.
Kisan Credit Card (KCC): Kheti ke kharch ke liye kam byaaj par karj. Byaaj dar aur chhoot ke niyam samay ke saath badalte hain, isliye apne bank se confirm karein.
PM Fasal Bima Yojana (PMFBY): Prakritik aapda se fasal kharaab hone par bima suraksha, kam premium par.
Soil Health Card: Mitti ki jaanch ki report aur khaad ki salaah, muft.

Apply kaise karein: Apne najdeeki CSC (Common Service Centre), krishi vibhag karyalay ya bank se sampark karein. Hamesha official sarkari website se hi jaankari lein aur kisi ko paise dekar apply na karein.

Niyam aur raashi badalti rehti hai, isliye aavedan se pehle official portal par taaza jaankari zaroor dekh lein.', 'Government Schemes', 'images/h2news3.jpg'),
('Smart Irrigation Techniques Saving Water', 'smart-irrigation-techniques-saving-water', 'Drip aur sprinkler se paani bachayein aur upaj badhayein.', 'Paani kheti ki sabse keemti chiz hai. Purane tareeke (baadh sinchai) me bahut paani bekaar jaata hai. Smart sinchai se aap kam paani me behtar upaj le sakte hain.

Drip irrigation (boond boond sinchai): Paani seedhe paudhe ki jad tak pahunchta hai. Sabzi, baagwaani aur kataar wali fasalon ke liye bahut achha.
Sprinkler: Gehun, chana, sarson jaisi fasalon ke liye upyogi. Hawa tez ho to dhyan rakhein.
Mulching: Mitti se paani ka vaashpan kam hota hai.
Sahi samay par sinchai: Subah jaldi ya shaam ko sinchai karein, dopahar me nahi.

Sarkar ki PM Krishi Sinchayee Yojana (Per Drop More Crop) ke antargat drip aur sprinkler par subsidy milti hai. Apne zile ke krishi vibhag se jaankari lein.', 'Irrigation', 'images/blog/bl2.jpg'),
('Dairy Farming: A Complete Beginner''s Guide', 'dairy-farming-guide', 'Chhoti dairy unit shuru karne ke liye zaroori baatein.', 'Dairy se rozana aay hoti hai aur kheti ke saath achha sahaara milta hai. Shuru karne se pehle in baaton ka dhyan rakhein.

Nasl ka chunav: Apne ilaake ke mausam ke hisaab se gir, sahiwal, murrah bhains ya sankar nasl chunein. Pehle 2-3 pashu se shuruaat karna surakshit hai.
Rehne ki jagah: Saaf, hawadaar aur sookha bada. Garmi me chhaya aur paani ka intezaam rakhein.
Aahaar: Hara chara, sookha chara aur santulit pashu aahaar. Saaf paani hamesha uplabdh ho.
Sehat: Niyamit teekakaran, kida-mukti aur doctor se jaanch karwayein.
Bikri: Najdeeki dairy cooperative ya samiti se judkar doodh ka sahi daam paayein.

Dairy loan aur subsidy ke liye NABARD aur apne bank se jaankari lein.', 'Dairy Farming', 'images/blog/bl1.jpg'),
('Kisan Credit Card (KCC): Kya Hai Aur Kaise Banwayein', 'kisan-credit-card-guide', 'Kheti ke kharch ke liye aasaan karj, KCC ki poori jaankari.', 'Kisan Credit Card (KCC) ek aisa card hai jisse kisaan beej, khaad, keetnashak aur doosre kheti ke kharch ke liye bank se karj le sakte hain.

Kaun le sakta hai: Zameen ke maalik kisaan, batai par kheti karne wale, pashupalak aur machhli palan karne wale bhi.
Zaroori kaagaz: Aadhaar card, zameen ke kaagaz, passport size photo aur bank khaata.
Kaise banwayein: Apne najdeeki bank (SBI, gramin bank, cooperative bank) ki shakha me form bharein.
Fayda: Kam byaaj par karj aur samay par chukane par byaaj me chhoot. Fasal bima bhi jod sakte hain.

Karj ki seema aur byaaj dar bank aur sarkaari niyam par nirbhar karti hai, isliye aavedan se pehle bank se taaza jaankari zaroor lein.', 'Government Schemes', 'images/h2news1.jpg')
on conflict (slug) do nothing;
