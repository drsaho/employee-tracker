DROP DATABASE IF EXISTS company_db;
-- Creates the "company" database --
CREATE DATABASE company_db;

\c company_db

-- Creates the table "department" within company_db --
CREATE TABLE department ( 
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  -- Creates a numeric column called "id" --
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL
);

CREATE TABLE employee ( 
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT
);

-- \i db/schema.sql --

-- SELECT * FROM department; --
