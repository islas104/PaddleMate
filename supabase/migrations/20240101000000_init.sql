-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- PROFILES (extends auth.users)
-- ─────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text not null,
  avatar_url  text,
  skill_level text not null default 'beginner'
                check (skill_level in ('beginner','intermediate','advanced','professional')),
  location    text,
  bio         text,
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────
-- CLUBS
-- ─────────────────────────────────────────────
create table public.clubs (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  address     text not null,
  city        text not null,
  country     text not null,
  phone       text,
  email       text,
  website     text,
  logo_url    text,
  cover_url   text,
  owner_id    uuid not null references public.profiles(id) on delete restrict,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.clubs enable row level security;

create policy "Clubs are viewable by everyone"
  on public.clubs for select using (is_active = true);

create policy "Club owners can update their club"
  on public.clubs for update using (auth.uid() = owner_id);

create policy "Authenticated users can create clubs"
  on public.clubs for insert with check (auth.uid() = owner_id);

-- ─────────────────────────────────────────────
-- CLUB MEMBERS
-- ─────────────────────────────────────────────
create table public.club_members (
  id        uuid primary key default gen_random_uuid(),
  club_id   uuid not null references public.clubs(id) on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  role      text not null default 'member'
              check (role in ('owner','admin','member')),
  joined_at timestamptz not null default now(),
  unique(club_id, user_id)
);

alter table public.club_members enable row level security;

create policy "Club members are viewable by everyone"
  on public.club_members for select using (true);

create policy "Club admins can manage members"
  on public.club_members for all using (
    exists (
      select 1 from public.club_members cm
      where cm.club_id = club_members.club_id
        and cm.user_id = auth.uid()
        and cm.role in ('owner','admin')
    )
  );

-- ─────────────────────────────────────────────
-- COURTS
-- ─────────────────────────────────────────────
create table public.courts (
  id              uuid primary key default gen_random_uuid(),
  club_id         uuid not null references public.clubs(id) on delete cascade,
  name            text not null,
  surface         text not null check (surface in ('artificial_grass','concrete','crystal','sand')),
  type            text not null check (type in ('indoor','outdoor','covered')),
  is_active       boolean not null default true,
  price_per_hour  numeric(10,2) not null,
  currency        text not null default 'EUR',
  image_url       text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.courts enable row level security;

create policy "Active courts are viewable by everyone"
  on public.courts for select using (is_active = true);

create policy "Club admins can manage courts"
  on public.courts for all using (
    exists (
      select 1 from public.club_members cm
      where cm.club_id = courts.club_id
        and cm.user_id = auth.uid()
        and cm.role in ('owner','admin')
    )
  );

-- ─────────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────────
create table public.bookings (
  id               uuid primary key default gen_random_uuid(),
  court_id         uuid not null references public.courts(id) on delete restrict,
  user_id          uuid not null references public.profiles(id) on delete restrict,
  starts_at        timestamptz not null,
  ends_at          timestamptz not null,
  duration_minutes int not null generated always as (
                     extract(epoch from (ends_at - starts_at))::int / 60
                   ) stored,
  total_price      numeric(10,2) not null,
  currency         text not null default 'EUR',
  status           text not null default 'pending'
                     check (status in ('pending','confirmed','cancelled','completed')),
  payment_status   text not null default 'unpaid'
                     check (payment_status in ('unpaid','paid','refunded')),
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  check (ends_at > starts_at)
);

alter table public.bookings enable row level security;

create policy "Users can view own bookings"
  on public.bookings for select using (auth.uid() = user_id);

create policy "Club admins can view bookings for their courts"
  on public.bookings for select using (
    exists (
      select 1 from public.courts c
      join public.club_members cm on cm.club_id = c.club_id
      where c.id = bookings.court_id
        and cm.user_id = auth.uid()
        and cm.role in ('owner','admin')
    )
  );

create policy "Authenticated users can create bookings"
  on public.bookings for insert with check (auth.uid() = user_id);

create policy "Users can cancel own bookings"
  on public.bookings for update using (auth.uid() = user_id);

-- Prevent double-booking via constraint
create unique index bookings_no_overlap
  on public.bookings (court_id, starts_at, ends_at)
  where status not in ('cancelled');

-- ─────────────────────────────────────────────
-- MATCHES
-- ─────────────────────────────────────────────
create table public.matches (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid references public.bookings(id) on delete set null,
  organizer_id uuid not null references public.profiles(id) on delete restrict,
  format       text not null check (format in ('singles','doubles')),
  skill_level  text not null,
  status       text not null default 'open'
                 check (status in ('open','full','completed','cancelled')),
  visibility   text not null default 'public'
                 check (visibility in ('public','private')),
  max_players  int not null check (max_players in (2,4)),
  description  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.matches enable row level security;

create policy "Public matches are viewable by everyone"
  on public.matches for select using (visibility = 'public' or auth.uid() = organizer_id);

create policy "Authenticated users can create matches"
  on public.matches for insert with check (auth.uid() = organizer_id);

create policy "Organizers can update their matches"
  on public.matches for update using (auth.uid() = organizer_id);

-- ─────────────────────────────────────────────
-- MATCH PLAYERS
-- ─────────────────────────────────────────────
create table public.match_players (
  id        uuid primary key default gen_random_uuid(),
  match_id  uuid not null references public.matches(id) on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique(match_id, user_id)
);

alter table public.match_players enable row level security;

create policy "Match players are viewable by everyone"
  on public.match_players for select using (true);

create policy "Authenticated users can join matches"
  on public.match_players for insert with check (auth.uid() = user_id);

create policy "Users can leave matches"
  on public.match_players for delete using (auth.uid() = user_id);

-- Auto-update match status when full
create or replace function public.update_match_status()
returns trigger language plpgsql security definer as $$
declare
  v_count int;
  v_max   int;
begin
  select count(*), m.max_players
  into v_count, v_max
  from public.match_players mp
  join public.matches m on m.id = mp.match_id
  where mp.match_id = new.match_id
  group by m.max_players;

  if v_count >= v_max then
    update public.matches set status = 'full' where id = new.match_id;
  end if;
  return new;
end;
$$;

create trigger on_match_player_joined
  after insert on public.match_players
  for each row execute function public.update_match_status();
