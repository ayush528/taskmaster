"""Task SQLAlchemy model."""

from __future__ import annotations

import enum
import uuid
from datetime import datetime
from datetime import timezone as dt_tz

from sqlalchemy import (
    String, Text, Float, Index, ForeignKey, TIMESTAMP, Enum, text,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PriorityEnum(str, enum.Enum):
    URGENT = "URGENT"
    HIGH = "HIGH"
    NORMAL = "NORMAL"
    LOW = "LOW"


class StatusEnum(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    BLOCKED = "blocked"


class Task(Base):
    __tablename__ = "tasks"
    __table_args__ = (
        Index("ix_tasks_user_status", "user_id", "status"),
        Index("ix_tasks_user_due", "user_id", "due_date"),
        Index("ix_tasks_user_priority", "user_id", "priority"),
        {"comment": "Core task entity"},
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    project_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="SET NULL"),
        index=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    priority: Mapped[PriorityEnum] = mapped_column(
        Enum(PriorityEnum, name="priority_enum", values_callable=lambda e: [x.value for x in e]),
        server_default="NORMAL",
    )
    status: Mapped[StatusEnum] = mapped_column(
        Enum(StatusEnum, name="status_enum", values_callable=lambda e: [x.value for x in e]),
        server_default="not_started",
    )
    due_date: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))
    estimated_hours: Mapped[float | None] = mapped_column(Float)
    actual_hours: Mapped[float | None] = mapped_column(Float)
    assigned_to: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"),
        index=True,
    )
    parent_task_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tasks.id", ondelete="CASCADE"),
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("now()"),
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("now()"),
        onupdate=lambda: datetime.now(dt_tz.utc),
    )
    completed_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))
    tags: Mapped[list[str] | None] = mapped_column(ARRAY(String))
    ai_breakdown: Mapped[dict | None] = mapped_column(JSONB)

    # relationships
    owner = relationship("User", back_populates="tasks", foreign_keys=[user_id])
    project = relationship("Project", back_populates="tasks")
    subtasks = relationship("Task", back_populates="parent", remote_side=[id])
    parent = relationship("Task", back_populates="subtasks", remote_side=[parent_task_id])
    reminders = relationship("Reminder", back_populates="task", cascade="all, delete-orphan")
    recurring_rule = relationship("RecurringRule", back_populates="task", uselist=False)
