# Gramin Saathi — Backend Setup Guide

Is website me ab Supabase backend + Admin Panel add ho chuka hai. Live karne ke liye ye steps follow karo.

## Step 1 — Supabase Project Banao
1. https://supabase.com par jaake free account banao
2. "New Project" click karo, naam do (jaise `gramin-saathi`), database password set karo
3. Project ready hone me 1-2 minute lagega

## Step 2 — Database Tables Banao
1. Supabase dashboard me left sidebar se **SQL Editor** kholo
2. `sql/schema.sql` file ka poora content copy karo
3. Paste karke **Run** click karo — ye 3 tables banayega: `blogs`, `messages`, `testimonials` (Row Level Security ke saath)

## Step 3 — API Keys Lo
1. Left sidebar me **Project Settings → API** kholo
2. **Project URL** copy karo
3. **anon public** key copy karo (service_role key kabhi use mat karna client-side code me)

## Step 4 — Keys Config Karo
`js/supabase-config.js` file kholo aur ye 2 lines edit karo:
```js
const SUPABASE_URL = "yaha apna project URL paste karo";
const SUPABASE_ANON_KEY = "yaha apna anon key paste karo";
```

## Step 5 — Admin User Banao
1. Supabase dashboard me **Authentication → Users** kholo
2. "Add User" click karo, apna email aur password daalo
3. Yehi email/password se `admin/login.html` par login hoga

## Step 6 — Test Karo (Local)
Site ko kisi local server se open karo (double-click se `file://` open karoge to CORS/fetch issue aa sakta hai):
```
python3 -m http.server 8000
```
Phir browser me `http://localhost:8000` kholo.

- `admin/login.html` — admin panel login
- `admin/dashboard.html` — blogs/messages/testimonials manage karo (login ke baad auto-redirect)
- `contact-one.html` — contact form submit karke check karo Supabase ke `messages` table me data aaya ya nahi
- `testimonials.html` — testimonial submit karke Supabase dashboard me check karo (approve karne ke baad hi public site pe dikhega)
- `blog.html` — admin panel se add kiya blog yaha automatically dikhega

## Step 7 — GitHub Pe Push Karo
```
git add .
git commit -m "Added Supabase backend + admin panel"
git push
```

## Step 8 — Vercel Pe Deploy Karo
1. https://vercel.com par GitHub se login karo
2. "Add New Project" → apna repo select karo
3. Framework: "Other" (koi build command nahi chahiye, static site hai)
4. Deploy click karo — live link mil jayega

## Important Security Notes
- `anon` key public hai, isse HTML/JS me daalna safe hai — security Row Level Security (RLS) policies se hoti hai jo `sql/schema.sql` me already set hain
- `service_role` key **kabhi bhi** kisi HTML/JS file me mat daalna
- Admin panel sirf Supabase Auth me register email/password wale user ko access deta hai

## What's Included
- `admin/login.html` — Admin login page
- `admin/dashboard.html` — Admin dashboard (Blogs CRUD, Messages, Testimonials approval)
- `js/supabase-config.js` — Supabase connection config (add your keys here)
- `sql/schema.sql` — Database schema + security policies
- `contact-one.html` — Contact form wired to save messages in database
- `testimonials.html` — Farmers can submit testimonials, admin approves before they go live
- `blog.html` — Dynamically loads blogs from database (falls back to sample content if none added yet)

## Content Fixes Already Done
- Broken links removed (`donation.html`, `team.html`, `team-two.html` — pointed to non-existent pages)
- Leftover charity-template content removed/replaced (Wildlife, Forest Planting, Recycling, Solar & Wind cards on homepage → replaced with real agriculture content)
- "Buy T-Shirts" shop widget removed from footer across all pages
- Homepage "Current Projects" section fully rewritten with agriculture-relevant content for all 4 tabs (Organic Farming, Dairy Farming, Government Schemes, Success Stories)
