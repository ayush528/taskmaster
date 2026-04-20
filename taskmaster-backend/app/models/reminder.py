"""Reminder SQLAlchemy model."""

from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    String, Integer, Boolean, ForeignKey, TIMESTAMP, Enum, text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ReminderTypeEnum(str, enum.Enum):
    IN_APP = "in_app"
    EMAIL = "email"
    SMS = "sms"


class ReminderFreqEnum(str, enum.Enum):
    ONCE = "once"
    DAILY = "daily"
    WEEKLY = "weekly"


class Reminder(Base):
    __tablename__ = "reminders"
    __table_args__ = {"comment": "Scheduled notifications for tasks"}

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    task_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tasks.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    reminder_type: Mapped[ReminderTypeEnum] = mapped_column(
        Enum(ReminderTypeEnum, name="reminder_type_enum", values_callable=lambda e: [x.value for x in e]),
        nullable=False,
    )
    scheduled_time: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False, index=True,
    )
    time_before_deadline: Mapped[int | None] = mapped_column(
        Integer, comment="Minutes before due date",
    )
    frequency: Mapped[ReminderFreqEnum] = mapped_column(
        Enum(ReminderFreqEnum, name="reminder_freq_enum", values_callable=lambda e: [x.value for x in e]),
        server_default="once",
    )
    is_sent: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    sent_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("now()"),
    )

    # relationships
    task = relationship("Task", back_populates="reminders")
