DROP DATABASE IF EXISTS company_db;
-- Creates the "inventory_db" database --
CREATE DATABASE company_db;

USE company_db;

-- Makes it so all of the following code will affect inventory_db --
\c company_db;

-- Creates the table "table" within inventory_db --
CREATE TABLE department ( 
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  -- Creates a numeric column called "id" --
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department_id
);

CREATE TABLE employee ( id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

