-- De app-gebruiker (MYSQL_USER in docker-compose.yml) krijgt van het image alleen rechten op MYSQL_DATABASE;
-- de server gebruikt ook de vaste database `shops` (config/connection_store.js).
GRANT ALL PRIVILEGES ON `shops`.* TO 'visualshopping'@'%';
