"""User SQLAlchemy model."""

from __future__ import annotations

import uuid
from datetime import datetime
from datetime import timezone as dt_tz

from sqlalchemy import String, TIMESTAMP, text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"
    __table_args__ = {"comment": "Core user accounts"}

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False,
        comment="Unique login email",
    )
    password_hash: Mapped[str] = mapped_column(
        String(255), nullable=False, comment="Bcrypt hash",
    )
    full_name: Mapped[str | None] = mapped_column(String(255))
    timezone: Mapped[str | None] = mapped_column(
        String(64), comment="IANA tz, e.g. Asia/Kolkata",
    )
    preferences: Mapped[dict | None] = mapped_column(JSONB, default=None)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("now()"),
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("now()"),
        onupdate=lambda: datetime.now(dt_tz.utc),
    )

    # relationships
    tasks = relationship("Task", back_populates="owner", foreign_keys="Task.user_id")
    projects = relationship("Project", back_populates="owner")
