create table if not exists public.profiles (
  id text primary key,
  email text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('cancion', 'videoclip', 'artista')),
  type text not null,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  details text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null default '',
  url text not null default '',
  description text not null default '',
  location_id uuid references public.locations(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.route_stops (
  route_id uuid not null references public.routes(id) on delete cascade,
  location_id uuid not null references public.locations(id) on delete cascade,
  position integer not null check (position > 0),
  primary key (route_id, location_id),
  unique (route_id, position)
);

create index if not exists songs_location_id_idx on public.songs(location_id);
create index if not exists route_stops_location_id_idx on public.route_stops(location_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.jwt()->>'sub')
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.replace_route_stops(
  p_route_id uuid,
  p_location_ids uuid[]
)
returns void
language plpgsql
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Only administrators can edit route stops'
      using errcode = '42501';
  end if;

  delete from public.route_stops where route_id = p_route_id;

  insert into public.route_stops (route_id, location_id, position)
  select p_route_id, stop.location_id, stop.position::integer
  from unnest(coalesce(p_location_ids, '{}'::uuid[])) with ordinality
    as stop(location_id, position);
end;
$$;

revoke all on function public.replace_route_stops(uuid, uuid[]) from public;
grant execute on function public.replace_route_stops(uuid, uuid[]) to authenticated;

alter table public.profiles enable row level security;
alter table public.locations enable row level security;
alter table public.songs enable row level security;
alter table public.routes enable row level security;
alter table public.route_stops enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.jwt()->>'sub'));

drop policy if exists "Admins can manage locations" on public.locations;
create policy "Admins can manage locations"
  on public.locations for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
drop policy if exists "Everyone can read published locations" on public.locations;
create policy "Everyone can read published locations"
  on public.locations for select to anon, authenticated
  using (is_active);

drop policy if exists "Admins can manage songs" on public.songs;
create policy "Admins can manage songs"
  on public.songs for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
drop policy if exists "Everyone can read published songs" on public.songs;
create policy "Everyone can read published songs"
  on public.songs for select to anon, authenticated
  using (is_active);

drop policy if exists "Admins can manage routes" on public.routes;
create policy "Admins can manage routes"
  on public.routes for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
drop policy if exists "Everyone can read published routes" on public.routes;
create policy "Everyone can read published routes"
  on public.routes for select to anon, authenticated
  using (is_active);

drop policy if exists "Admins can manage route stops" on public.route_stops;
create policy "Admins can manage route stops"
  on public.route_stops for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
drop policy if exists "Everyone can read stops of published routes" on public.route_stops;
create policy "Everyone can read stops of published routes"
  on public.route_stops for select to anon, authenticated
  using (
    exists (
      select 1 from public.routes
      where routes.id = route_stops.route_id
        and routes.is_active
    )
  );

grant select on public.locations, public.songs, public.routes, public.route_stops to anon, authenticated;
grant select on public.profiles to authenticated;
grant insert, update, delete on public.locations, public.songs, public.routes, public.route_stops to authenticated;

insert into public.locations (id, name, category, type, latitude, longitude, details)
values
  ('00000000-0000-4000-8000-000000000001', 'Barrio Histórico', 'cancion', 'Canción sobre el lugar', -34.4719, -57.8579, 'Letras y canciones que nombran las calles, la historia o la vida del barrio.'),
  ('00000000-0000-4000-8000-000000000002', 'Faro de Colonia', 'artista', 'Artista de la zona', -34.4717, -57.8515, 'Una búsqueda abierta de artistas nacidos en Colonia y sus alrededores.'),
  ('00000000-0000-4000-8000-000000000003', 'Real de San Carlos', 'videoclip', 'Videoclip filmado aquí', -34.4385, -57.8425, 'Videoclips y sesiones musicales registrados en este rincón de la ciudad.'),
  ('00000000-0000-4000-8000-000000000004', 'Rambla de Colonia', 'videoclip', 'Videoclip filmado aquí', -34.441478, -57.869365, 'https://youtu.be/8_CcdCDMkcw?si=Rbzj-cxehUK_0bnp'),
  ('00000000-0000-4000-8000-000000000005', 'Luana', 'artista', 'Artista de Colonia', -34.450060, -57.816829, 'Luana Persincula, conocida artísticamente como Luana.')
on conflict (id) do nothing;
