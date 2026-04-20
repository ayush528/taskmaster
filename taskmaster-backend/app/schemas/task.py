"""Pydantic schemas for Task endpoints."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field

from app.models.task import PriorityEnum, StatusEnum


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    priority: PriorityEnum = PriorityEnum.NORMAL
    due_date: Optional[datetime] = None
    estimated_hours: Optional[float] = None
    project_id: Optional[uuid.UUID] = None
    assigned_to: Optional[uuid.UUID] = None
    parent_task_id: Optional[uuid.UUID] = None
    tags: Optional[List[str]] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[PriorityEnum] = None
    status: Optional[StatusEnum] = None
    due_date: Optional[datetime] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    project_id: Optional[uuid.UUID] = None
    assigned_to: Optional[uuid.UUID] = None
    tags: Optional[List[str]] = None


class TaskOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    project_id: Optional[uuid.UUID]
    title: str
    description: Optional[str]
    priority: PriorityEnum
    status: StatusEnum
    due_date: Optional[datetime]
    estimated_hours: Optional[float]
    actual_hours: Optional[float]
    assigned_to: Optional[uuid.UUID]
    parent_task_id: Optional[uuid.UUID]
    tags: Optional[List[str]]
    ai_breakdown: Optional[dict]
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]

    model_config = {"from_attributes": True}
