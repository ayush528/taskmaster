"""Pydantic schemas for Reminder endpoints."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.reminder import ReminderTypeEnum, ReminderFreqEnum


class ReminderCreate(BaseModel):
    task_id: uuid.UUID
    reminder_type: ReminderTypeEnum
    scheduled_time: datetime
    time_before_deadline: Optional[int] = None
    frequency: ReminderFreqEnum = ReminderFreqEnum.ONCE


class ReminderUpdate(BaseModel):
    reminder_type: Optional[ReminderTypeEnum] = None
    scheduled_time: Optional[datetime] = None
    frequency: Optional[ReminderFreqEnum] = None


class ReminderOut(BaseModel):
    id: uuid.UUID
    task_id: uuid.UUID
    user_id: uuid.UUID
    reminder_type: ReminderTypeEnum
    scheduled_time: datetime
    time_before_deadline: Optional[int]
    frequency: ReminderFreqEnum
    is_sent: bool
    sent_at: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}
