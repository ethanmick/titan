CREATE EXTENSION pgcrypto;
CREATE EXTENSION pg_stat_statements;

begin transaction;

create table users (
  id serial not null primary key,
  username text not null,
  password text not null,
  token text,
  last_game_update timestamptz,
  -- Model Objects
  created_at timestamptz not null default now(),
  updated_at timestamptz 
);

-- Game
create table buildings (
  id serial not null primary key,
  user_id int not null,
  name text not null,
  description text not null,
  type text not null,
  level int not null,
  resource text,
  -- Model Objects
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

create table resources (
  id serial not null primary key,
  user_id int not null,
  resource text not null,
  amount double precision not null,
  -- Model Objects
  created_at timestamptz not null default now(),
  updated_at timestamptz
);


create table research (
  id serial not null primary key,
  user_id int not null,
  name text not null,
  description text not null,
  type text not null,
  level int not null,
  -- Model Objects
  created_at timestamptz not null default now(),
  updated_at timestamptz
);


create table ships (
  id serial not null primary key,
  user_id int not null,
  name text not null,
  description text not null,
  type text not null,
  -- amount?
  -- Model Objects
  created_at timestamptz not null default now(),
  updated_at timestamptz
);


-- Task queue
create table tasks (
  id serial not null primary key,
  user_id int not null,
  type text not null,
  context jsonb not null,
  done_at timestamptz not null,
  -- Model Objects
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

commit;

-- Foreign Keys