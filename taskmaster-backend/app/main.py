"""
TaskMaster FastAPI application – entry point.

Run with:
    uvicorn app.main:app --reload
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.config import configure_logging, get_settings
from app.database import engine, Base
from app.middleware import register_middleware

# Import routers
from app.routers import auth, tasks, projects, reminders, ai, team

logger = logging.getLogger("taskmaster")


# ── Lifespan (startup / shutdown) ────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ───────────────────────────────────────────────────────
    configure_logging()
    settings = get_settings()
    logger.info("Starting TaskMaster API (env=%s)", settings.APP_ENV)

    # Create tables if they don't exist (dev convenience – use Alembic in prod)
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables ensured")

    yield  # App is running

    # ── Shutdown ──────────────────────────────────────────────────────
    logger.info("Shutting down TaskMaster API")
    engine.dispose()


# ── App instance ─────────────────────────────────────────────────────

app = FastAPI(
    title="TaskMaster API",
    description="AI-powered task management backend",
    version="1.0.0",
    lifespan=lifespan,
)

# Register middleware (CORS, logging, error handlers)
register_middleware(app)

# Register routers
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(projects.router)
app.include_router(reminders.router)
app.include_router(ai.router)
app.include_router(team.router)


# ── Health check ─────────────────────────────────────────────────────

@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok", "service": "taskmaster-api"}
