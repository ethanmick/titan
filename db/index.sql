CREATE EXTENSION pgcrypto;
CREATE EXTENSION pg_stat_statements;

begin transaction;

create table users (
  id serial not null primary key,
  username text not null,
  password text not null,
  token text,
  last_game_update timestamp without time zone,
  -- Model Objects
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone
);

-- Game
create table buildings (
  id serial not null primary key,
  user_id int not null,
  name text not null,
  level int not null,
  -- Model Objects
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone
);

create table resources (
  id serial not null primary key,
  user_id int not null,
  resource text not null,
  amount int not null,
  -- Model Objects
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone
);

commit;

-- Foreign Keys