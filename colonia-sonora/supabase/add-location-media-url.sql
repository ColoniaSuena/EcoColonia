alter table public.locations
  add column if not exists media_url text not null default '';
