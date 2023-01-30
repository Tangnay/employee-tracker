INSERT INTO department (id, name)
VALUES (2, "Enginnering"),
       (3, "Finance"),
       (4, "Legal"),
       (1, "Sales");


INSERT INTO role (id, title, department_id, salary)
VALUES (1, "Sales Lead", 1, 100000.00),
       (2, "Salesperson", 1, 8000.00),
       (3, "Lead Engineer", 2, 150000.00),
       (4, "Software Enginner", 2, 120000.00),
       (5, "Account Manager", 3, 160000.00),
       (6, "Accountant", 3, 125000.00), 
       (7, "Legal Team Lead", 4, 250000.00), 
       (8, "Lawyer", 4, 190000.00);


INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  (1, "John", "Doe", 1, null),  
        (2, "Mike", "Chan", 2, 1),  
        (3, "Ashley", "Rodriguez", 3, null),  
        (4, "Kevin", "Tupik", 4, 3), 
        (5, "Kunal", "Singh", 5, null), 
        (6, "Malia", "Brown", 6, 5), 
        (7, "Sarah", "Lourd", 7, null), 
        (8, "Tom", "Allen", 8, 7); 




