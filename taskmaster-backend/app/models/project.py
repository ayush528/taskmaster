"""Project SQLAlchemy model."""

from __future__ import annotations

import uuid
from datetime import datetime
from datetime import timezone as dt_tz

from sqlalchemy import String, Text, Boolean, ForeignKey, TIMESTAMP, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Project(Base):
    __tablename__ = "projects"
    __table_args__ = {"comment": "Project containers for tasks"}

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    color: Mapped[str | None] = mapped_column(String(7), comment="Hex e.g. #ff6600")
    is_team_project: Mapped[bool] = mapped_column(
        Boolean, server_default=text("false"),
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("now()"),
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("now()"),
        onupdate=lambda: datetime.now(dt_tz.utc),
    )

    # relationships
    owner = relationship("User", back_populates="projects")
    tasks = relationship("Task", back_populates="project")
    team_members = relationship("TeamMember", back_populates="project", cascade="all, delete-orphan")
