-- Seed Local Development DB
insert into users (username, password, token) values (
    'em',
    -- 'password', very secure
    '$2b$12$Vi3ALcFAmupQCpP.5F08aeAROgZ8JVyvbR7QWj/PAzc.R9kaBTP/6',
    'token'
);

-- Default Resources
insert into resources (user_id, resource, amount) values
(1, 'metal', 500),
(1, 'crystal', 200),
(1, 'deuterium', 0)
;