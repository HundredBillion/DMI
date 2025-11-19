# DMI CSV Uploader

Rails API + Vite/React application that accepts CSV uploads, parses them server-side, and renders the data in a sortable table on the frontend.

## Project layout

```
api/  # Rails API-only backend with CSV parsing service and specs
web/  # Vite + React + TypeScript frontend with upload/table UI and Vitest suite
```

## Backend setup (`api/`)

```bash
cd /Users/davidlee/code/DMI/api
bundle install
bin/rails db:migrate
bin/rails server
FRONTEND_ORIGIN=http://localhost:5173 
```

- SQLite is used in development/test, so no external DB is required.
- `FRONTEND_ORIGIN` controls allowed CORS origins; defaults to `http://localhost:5173` if unset.
- Run tests with `bundle exec rspec`.

## Frontend setup (`web/`)

```bash
cd /Users/davidlee/code/DMI/web
npm install
cp .env.example .env
npm run dev
```

- Update `.env` if the API base URL differs from `http://localhost:3000`.
- Run unit tests with `npm run test -- --run`.

## API contract

- **Endpoint**: `POST /api/csv_uploads`
- **Request**: `multipart/form-data` with field `file` (a `.csv`).
- **Response** (`200 OK`):
  ```json
  {
    "filename": "sample.csv",
    "headers": ["first_name", "last_name"],
    "rows": [{"first_name": "Ada", "last_name": "Lovelace"}],
    "rowCount": 1,
    "errors": [],
    "truncated": false
  }
  ```
- **422 Unprocessable Content**: `{ "errors": ["A CSV file is required"] }`

## Development notes

- The Rails service streams uploads via `CsvParser`, minimizing memory use and collecting parser warnings.
- Vite dev server proxies `/api/*` requests to the API base URL specified in `VITE_API_BASE_URL`, so the frontend can call the backend without extra configuration during development.
- Adjust future limits (file size, row caps) inside `CsvUploadsController` or `CsvParser` as requirements evolve.
