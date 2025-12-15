create table avatars (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  svg_content text not null,
  prompt text,
  style_tags jsonb,
  color_palette text,
  is_public boolean default true
);

alter table avatars enable row level security;

create policy "Enable read access for all users"
on "public"."avatars"
as PERMISSIVE
for SELECT
to public
using (
  true
);

create policy "Enable insert for all users"
on "public"."avatars"
as PERMISSIVE
for INSERT
to public
with check (
  true
);
