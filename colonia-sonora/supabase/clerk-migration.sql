begin;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop policy if exists "Users can read their own profile" on public.profiles;

alter table public.profiles
  drop constraint if exists profiles_id_fkey;

alter table public.profiles
  alter column id type text using id::text;

update public.profiles
set role = 'user'
where id !~ '^user_';

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

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.jwt()->>'sub'));

commit;
