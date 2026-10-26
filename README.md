# Visualshopping-Server

API van de online winkel van Coop Lubbers (Visual Shopping): Express met Sequelize op MySQL 8.

- `/api/v1/…`: producten, afdelingen, klanten, bestellingen, acties (`routes/`, `models/`, database `cooplubbers_test`)
- `/api/v2/…`: winkelgegevens zoals tijdsloten, vacatures en voorwaarden (`store_routes/`, `store_models/`, database `shops`)
- `/api/back-images/…`: bestanden uit `public/` (productafbeeldingen, uploads)

## Draaien met Docker

```
docker compose up -d --build
```

De eerste start bouwt de database op uit `db/` (schema plus de productcatalogus, ongeveer een minuut). Daarna staat de
API op poort 8106. In `docker-compose.yml` is die aan het Tailscale-adres van de homelab gebonden; lokaal kun je dat
veranderen in `"127.0.0.1:8106:3001"`.

| Bestand in `db/` | Inhoud |
| --- | --- |
| `01_schema_cooplubbers_test.sql`, `02_schema_shops.sql` | structuur van beide databases, zonder data |
| `03_grants.sql` | rechten van de app-gebruiker op `shops` |
| `04_productdata.sql`, `05_shopsdata.sql` | productcatalogus, afdelingen en winkelinformatie (geen klant-, order- of medewerkergegevens) |

De scripts draaien alleen bij een lege volume. Opnieuw opbouwen: `docker compose down -v` en weer `up`.

## Demo

- Een klantaccount maak je aan via `POST /api/v1/customer/` (de klantapp doet dat bij registreren).
- **Afrekenen werkt niet**: er staat geen echte Mollie-sleutel in de compose. Met een eigen testsleutel van Mollie
  (`MOLLIE_API`, `MOLLIE_TEST_API`) werkt het wel.
- **Geen mail**: `MAIL_USER` is leeg.
- **Geen productafbeeldingen**: die staan niet in de repo. Ze horen in `public/products/` (volume `public`).

Alle variabelen staan in `.env.example`.
