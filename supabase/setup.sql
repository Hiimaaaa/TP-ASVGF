-- RUN THIS IN SUPABASE SQL EDITOR TO FIX DELETION ISSUES

-- 1. SETUP DATABASE TABLE
create table if not exists avatars (
  id bigint primary key generated always as identity,
  image_url text not null,
  prompt text not null,
  created_at timestamptz default now()
);

-- Reset RLS (Safety first)
alter table avatars disable row level security;
alter table avatars enable row level security;

-- TABLE POLICIES (Drop first to avoid "already exists" errors)
drop policy if exists "Enable read access for all users" on avatars;
create policy "Enable read access for all users"
on avatars for select
to anon
using (true);

drop policy if exists "Enable insert access for all users" on avatars;
create policy "Enable insert access for all users"
on avatars for insert
to anon
with check (true);

drop policy if exists "Enable delete for all users" on avatars;
create policy "Enable delete for all users"
on avatars for delete
to anon
using (true);


-- 2. SETUP STORAGE BUCKET PERMISSIONS
update storage.buckets
set public = true
where name = 'avatars';

-- STORAGE POLICIES
drop policy if exists "Give public access to avatars" on storage.objects;
create policy "Give public access to avatars"
on storage.objects for select
to public
using ( bucket_id = 'avatars' );

drop policy if exists "Allow uploads to avatars" on storage.objects;
create policy "Allow uploads to avatars"
on storage.objects for insert
to public
with check ( bucket_id = 'avatars' );

drop policy if exists "Allow public delete" on storage.objects;
create policy "Allow public delete"
on storage.objects for delete
to public
using ( bucket_id = 'avatars' );
