"""Team router – /team endpoints for project membership."""

from __future__ import annotations

import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.models.project import Project
from app.models.recurring import TeamMember
from app.schemas.project import TeamMemberAdd, TeamMemberOut

router = APIRouter(prefix="/team", tags=["team"])


@router.post(
    "/projects/{project_id}/members",
    response_model=TeamMemberOut,
    status_code=status.HTTP_201_CREATED,
)
def add_member(
    project_id: uuid.UUID,
    payload: TeamMemberAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify ownership
    project = db.query(Project).filter(
        Project.id == project_id, Project.user_id == current_user.id,
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    existing = db.query(TeamMember).filter(
        TeamMember.project_id == project_id,
        TeamMember.user_id == payload.user_id,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="User already a member")

    member = TeamMember(
        project_id=project_id,
        user_id=payload.user_id,
        role=payload.role,
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.get("/projects/{project_id}/members", response_model=List[TeamMemberOut])
def list_members(
    project_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(TeamMember).filter(TeamMember.project_id == project_id).all()


@router.delete(
    "/projects/{project_id}/members/{member_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_member(
    project_id: uuid.UUID,
    member_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    member = db.query(TeamMember).filter(
        TeamMember.id == member_id,
        TeamMember.project_id == project_id,
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(member)
    db.commit()
