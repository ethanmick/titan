CREATE EXTENSION pgcrypto;
CREATE EXTENSION pg_stat_statements;

begin transaction;

create table users (
  id serial not null primary key,
  email text not null,
  password text not null,
  -- Model Objects
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone
);

commit;