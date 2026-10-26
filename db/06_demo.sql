-- Demo-gegevens bovenop de rebuild. Idempotent: ook los te draaien op een bestaande database
-- (op de homelab via changes/0003 in de homelab-repo).

-- Een werknemer om in te loggen in de werknemers-app: demo@example.com / demo1234 (rol Admin).
-- Nieuwe werknemers maken kan alleen een ingelogde werknemer (POST /api/v1/user); /user/register werkt niet.
INSERT IGNORE INTO `cooplubbers_test`.`User` (`user_id`, `name`, `email`, `password`, `role_id`, `createdAt`, `updatedAt`)
VALUES ('00000000-0000-4000-8000-000000000001', 'Demo Werknemer', 'demo@example.com',
        '$2a$10$Ei58GoGb5gV0.LAVCR0nY.TeJoACXMOI2/JdjadX0/UklVOH0pbmW',
        'b4d709b5-b4ed-11ec-9698-0242ac110003', NOW(), NOW());

-- Het winkellogo uit de eigen volume in plaats van van www.cooplubbers.nl (staat zo ook al in 05_shopsdata.sql).
UPDATE `shops`.`Information`
SET `logo_url` = REPLACE(`logo_url`, 'https://www.cooplubbers.nl/api/back-images/', '/api/back-images/')
WHERE `logo_url` LIKE 'https://www.cooplubbers.nl/api/back-images/%';
