# Auto Serwis Głąbcio

Strona wizytówka warsztatu samochodowego **Auto Serwis Głąbcio** w Ostrowie Wielkopolskim.
Statyczna aplikacja frontendowa (SPA) – bez backendu i bazy danych.

## Technologie

- Vite
- TypeScript
- React
- Tailwind CSS
- shadcn/ui

## Wymagania

- Node.js 18+ oraz npm

## Uruchomienie lokalne

```sh
# 1. Instalacja zależności
npm install

# 2. Serwer deweloperski (http://localhost:8080)
npm run dev
```

## Budowanie wersji produkcyjnej

```sh
npm run build
```

Wynik trafia do katalogu `dist/` – gotowe pliki statyczne (HTML/CSS/JS)
do wgrania na dowolny serwer WWW (np. nginx).

Podgląd zbudowanej wersji:

```sh
npm run preview
```

## Testy i lint

```sh
npm test      # testy jednostkowe (Vitest)
npm run lint  # ESLint
```

## Wdrożenie

Aplikacja jest statyczna – wystarczy zbudować (`npm run build`) i serwować
zawartość katalogu `dist/` przez serwer WWW. Ponieważ to SPA z React Router,
serwer musi kierować nieznane ścieżki do `index.html` (fallback).
