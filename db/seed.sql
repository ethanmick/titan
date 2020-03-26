-- Seed Local Development DB
insert into users (username, password, token) values (
    'em',
    -- 'password', very secure
    '$2b$12$Vi3ALcFAmupQCpP.5F08aeAROgZ8JVyvbR7QWj/PAzc.R9kaBTP/6',
    'token'
);

-- Game Resources
insert into resources (name, description) values
('metal', 'A common resource'),
('crystal', 'Used in electric circuits'),
('deuterium', 'Fuel for ships')
;