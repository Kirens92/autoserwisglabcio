# Auto Serwis Gl@bcio

Strona i panel administracyjny warsztatu **Auto Serwis Gl@bcio** w Ostrowie Wielkopolskim.

## Technologie

- React 18
- Vite 5
- TypeScript
- Tailwind CSS
- shadcn/ui
- Node.js HTTP server
- pliki danych JSON w trwałym katalogu `DATA_DIR`

## Główne adresy

- `/` – obecna strona główna
- `/nowa-strona` – nowy projekt strony głównej czarno-złoto-biały
- `/uslugi` – pełna oferta usług
- `/realizacje` – realizacje warsztatu
- `/admin` – logowanie i edytor usług
- `/admin/strona` – CMS nowej strony głównej
- `/admin/realizacje` – edytor realizacji

## CMS nowej strony

Panel `/admin/strona` pozwala zarządzać bez edycji kodu:

- SEO: title, description i robots,
- telefonem, adresem, e-mailem i godzinami otwarcia,
- menu,
- sekcją Hero,
- komunikacją specjalizacji Peugeot i Citroën / PSA / Stellantis,
- kafelkami usług,
- sekcją O nas,
- statystykami,
- procesem obsługi klienta,
- opiniami,
- końcowym CTA,
- stopką i szybkimi linkami.

Nowa strona pobiera treść z `GET /api/site-content`. Zapis z panelu odbywa się przez chronione sesją administratora `PUT /api/admin/site-content`.

## Dane i trwałość

Serwer zapisuje dane w katalogu wskazanym przez `DATA_DIR`:

- `services.json`
- `realizations.json`
- `site-content.json`
- `uploads/`

Na produkcji w Coolify ustaw:

```env
DATA_DIR=/app/data
```

i zamontuj **Persistent Storage / Volume** dla `/app/data`. Bez trwałego wolumenu edycje CMS mogą zniknąć przy odtworzeniu kontenera.

## Zmienne środowiskowe

```env
ADMIN_LOGIN=...
ADMIN_PASSWORD=...
SESSION_SECRET=...
DATA_DIR=/app/data
```

`SESSION_SECRET` powinien być długim losowym sekretem i nie powinien być przechowywany w repozytorium.

## Uruchomienie lokalne

```sh
npm install
npm run build
npm start
```

Serwer produkcyjny domyślnie działa na porcie `3000` lub wartości `PORT` przekazanej przez środowisko.

## Walidacja

Repozytorium zawiera GitHub Actions `.github/workflows/validate.yml`, który dla `main` wykonuje:

```sh
npm ci
npx tsc --noEmit -p tsconfig.app.json
npm run build
```

Dzięki temu błędy TypeScript i błędy budowania są wykrywane przed dalszym wdrożeniem.
