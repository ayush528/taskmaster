"""Pydantic schemas for Project & Team endpoints."""

from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field

from app.models.recurring import TeamRoleEnum


class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    color: Optional[str] = Field(None, pattern=r"^#[0-9a-fA-F]{6}$")
    is_team_project: bool = False


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    is_team_project: Optional[bool] = None


class ProjectOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    name: str
    description: Optional[str]
    color: Optional[str]
    is_team_project: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TeamMemberAdd(BaseModel):
    user_id: uuid.UUID
    role: TeamRoleEnum = TeamRoleEnum.MEMBER


class TeamMemberOut(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    user_id: uuid.UUID
    role: TeamRoleEnum
    joined_at: datetime

    model_config = {"from_attributes": True}
