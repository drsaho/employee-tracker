-- Connect to the company_db database
\c company_db

-- sample departments
INSERT INTO department (name) VALUES
('Robotics'),
('Engineering'),
('Testing');

-- Insert sample roles
INSERT INTO role (title, salary, department_id) VALUES
('Robotics Engineer', 100000, 1),
('Software Engineer', 100000, 2),
('Test Engineer', 70000, 3);

-- Insert sample employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Bino', 'Sino', 1, NULL),
('Kino', 'Mino', 2, NULL),
('Philip', 'Collins', 3, NULL),
('Buba', 'Evans', 2, 2);  -- Buba Evans is managed by Jane Smith
