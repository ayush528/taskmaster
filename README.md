# TaskMaster — How to Run & Stop

## Prerequisites

Make sure you have the following installed on your machine:

- **Docker** (v20+) — [Install Guide](https://docs.docker.com/engine/install/)
- **Docker Compose Plugin** (v2+) — usually bundled with Docker Desktop; on Linux run:
  ```bash
  sudo apt install docker-compose-plugin
  ```

> **Note:** Use `docker compose` (with a space), **not** the old `docker-compose` (with a hyphen).

---

## Quick Start

### 1. Clone & Navigate

```bash
cd /path/to/sepm/stitch_login_page
```

### 2. Start Everything

```bash
docker compose up --build
```

This single command spins up **3 containers**:

| Container              | Service    | Port   | Description                        |
|------------------------|------------|--------|------------------------------------|
| `taskmaster-db`        | PostgreSQL | `5432` | Database (data persists in volume) |
| `taskmaster-backend`   | FastAPI    | `8000` | REST API backend                   |
| `taskmaster-frontend`  | Next.js    | `3000` | Web UI                             |

### 3. Access the App

Once you see this in the logs:

```
taskmaster-frontend  | ▲ Next.js 16.2.1 (Turbopack)
taskmaster-frontend  | - Local:    http://localhost:3000
taskmaster-frontend  | - Network:  http://0.0.0.0:3000
taskmaster-frontend  | ✓ Ready in 2.3s
```

Open your browser and go to:

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **API Health:** [http://localhost:8000/health](http://localhost:8000/health)
- **API Docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

### 4. Run in Background (Detached Mode)

If you don't want to keep the terminal occupied:

```bash
docker compose up --build -d
```

Check logs anytime with:

```bash
docker compose logs -f            # all services
docker compose logs -f frontend   # frontend only
docker compose logs -f backend    # backend only
```

---

## Stopping the App

### Option A: Foreground Mode (if you ran without `-d`)

Press **`Ctrl + C`** in the terminal. Then clean up:

```bash
docker compose down
```

### Option B: Detached Mode

```bash
docker compose down
```

### Stop & Remove Everything (including database data)

```bash
docker compose down -v
```

> **Warning:** The `-v` flag deletes the PostgreSQL volume, wiping all stored data.

---

## Common Issues & Fixes

### Port already in use

If you see `address already in use` for port 8000 or 3000:

```bash
# Kill whatever is using the port
sudo fuser -k 8000/tcp
sudo fuser -k 3000/tcp

# Then start again
docker compose up --build -d
```

### Backend crashes on first start

This happens because the backend boots faster than PostgreSQL. The `docker-compose.yaml` includes `restart: on-failure` and a DB health check, so **it recovers automatically** within ~30 seconds.

### Old container name conflict

```bash
docker compose down       # stop everything
docker compose up --build # rebuild fresh
```

---

## Project Structure

```
stitch_login_page/
├── docker-compose.yaml          # Orchestrates all 3 services
├── README.md                    # This file
├── docs/
│   ├── FUNCTIONAL_SPEC.md       # Functional requirements
│   ├── TEST_CASES.md            # QA test case template
│   └── SPRINT_RETROSPECTIVE.md  # Sprint retro notes
├── task-app/                    # Next.js Frontend
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── app/
│   │   ├── components/          # UI components
│   │   ├── context/             # React context providers
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utilities (search, analytics, API)
│   │   ├── dashboard/           # Dashboard page
│   │   ├── projects/            # Projects page
│   │   ├── calendar/            # Calendar page
│   │   ├── team/                # Team management page
│   │   └── profile/             # Profile & Settings page
│   └── package.json
└── taskmaster-backend/          # FastAPI Backend
    ├── Dockerfile
    ├── .dockerignore
    ├── requirements.txt
    ├── .env                     # Environment variables
    └── app/
        ├── main.py              # FastAPI entry point
        ├── config.py            # Settings & logging
        ├── database.py          # SQLAlchemy engine
        ├── models/              # DB models
        ├── routers/             # API route handlers
        └── middleware.py        # CORS, error handling
```
