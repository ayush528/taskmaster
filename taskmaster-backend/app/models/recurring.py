"""Recurring rule, Team member, AI log, Task history, User preferences models."""

from __future__ import annotations

import enum
import uuid
from datetime import datetime
from datetime import timezone as dt_tz

from sqlalchemy import (
    String, Integer, Boolean, Float, ForeignKey, TIMESTAMP, Enum,
    UniqueConstraint, Numeric, text,
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


# ── Recurring Rules ───────────────────────────────────────────────────

class RecurringFreqEnum(str, enum.Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    BIWEEKLY = "biweekly"
    MONTHLY = "monthly"


class RecurringRule(Base):
    __tablename__ = "recurring_rules"
    __table_args__ = {"comment": "Recurrence definitions for tasks"}

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    original_task_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tasks.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    frequency: Mapped[RecurringFreqEnum] = mapped_column(
        Enum(RecurringFreqEnum, name="recurring_freq_enum", values_callable=lambda e: [x.value for x in e]),
        nullable=False,
    )
    interval: Mapped[int] = mapped_column(Integer, server_default="1")
    days_of_week: Mapped[list[int] | None] = mapped_column(
        ARRAY(Integer), comment="ISO weekday numbers (1=Mon … 7=Sun)",
    )
    end_date: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))
    occurrence_count: Mapped[int | None] = mapped_column(Integer)
    next_occurrence: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("now()"),
    )

    task = relationship("Task", back_populates="recurring_rule")


# ── Team Members ──────────────────────────────────────────────────────

class TeamRoleEnum(str, enum.Enum):
    ADMIN = "admin"
    MEMBER = "member"


class TeamMember(Base):
    __tablename__ = "team_members"
    __table_args__ = (
        UniqueConstraint("project_id", "user_id", name="uq_team_project_user"),
        {"comment": "User–project membership"},
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    project_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    role: Mapped[TeamRoleEnum] = mapped_column(
        Enum(TeamRoleEnum, name="team_role_enum", values_callable=lambda e: [x.value for x in e]),
        nullable=False,
    )
    joined_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("now()"),
    )

    project = relationship("Project", back_populates="team_members")


# ── AI Requests Log ──────────────────────────────────────────────────

class AIRequestTypeEnum(str, enum.Enum):
    BREAKDOWN = "breakdown"
    SUMMARIZE = "summarize"
    PRIORITIZE = "prioritize"
    SCHEDULE = "schedule"
    SUGGEST = "suggest"


class AIRequestLog(Base):
    __tablename__ = "ai_requests_log"
    __table_args__ = {"comment": "Audit trail for AI operations"}

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"),
        nullable=False, index=True,
    )
    task_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tasks.id", ondelete="SET NULL"),
    )
    request_type: Mapped[AIRequestTypeEnum] = mapped_column(
        Enum(AIRequestTypeEnum, name="ai_request_type_enum", values_callable=lambda e: [x.value for x in e]),
        nullable=False,
    )
    input_tokens: Mapped[int] = mapped_column(Integer, nullable=False)
    output_tokens: Mapped[int] = mapped_column(Integer, nullable=False)
    model_used: Mapped[str] = mapped_column(String(64), nullable=False)
    cost: Mapped[float] = mapped_column(Numeric(10, 5), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("now()"),
    )


# ── Task History ─────────────────────────────────────────────────────

class TaskHistory(Base):
    __tablename__ = "task_history"
    __table_args__ = {"comment": "Status change log for analytics"}

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    task_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("tasks.id", ondelete="CASCADE"),
        nullable=False, index=True,
    )
    status_changed_from: Mapped[str] = mapped_column(String(32), nullable=False)
    status_changed_to: Mapped[str] = mapped_column(String(32), nullable=False)
    changed_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"),
        nullable=False,
    )
    changed_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("now()"),
    )


# ── User Preferences ────────────────────────────────────────────────

class ThemeEnum(str, enum.Enum):
    DARK = "dark"
    LIGHT = "light"


class DefaultPriorityEnum(str, enum.Enum):
    URGENT = "URGENT"
    HIGH = "HIGH"
    NORMAL = "NORMAL"
    LOW = "LOW"


class UserPreference(Base):
    __tablename__ = "user_preferences"
    __table_args__ = {"comment": "Extended user settings"}

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False, unique=True,
    )
    theme: Mapped[ThemeEnum] = mapped_column(
        Enum(ThemeEnum, name="theme_enum", values_callable=lambda e: [x.value for x in e]),
        server_default="light",
    )
    email_notifications: Mapped[bool] = mapped_column(Boolean, server_default=text("true"))
    sms_notifications: Mapped[bool] = mapped_column(Boolean, server_default=text("false"))
    phone_number: Mapped[str | None] = mapped_column(
        String(255), comment="Encrypted phone for SMS",
    )
    reminders_24h_before: Mapped[bool] = mapped_column(Boolean, server_default=text("true"))
    reminders_6h_before: Mapped[bool] = mapped_column(Boolean, server_default=text("true"))
    reminders_1h_before: Mapped[bool] = mapped_column(Boolean, server_default=text("true"))
    default_priority: Mapped[DefaultPriorityEnum] = mapped_column(
        Enum(DefaultPriorityEnum, name="default_priority_enum", values_callable=lambda e: [x.value for x in e]),
        server_default="NORMAL",
    )
    default_project_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("projects.id", ondelete="SET NULL"),
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True), server_default=text("now()"),
        onupdate=lambda: datetime.now(dt_tz.utc),
    )
