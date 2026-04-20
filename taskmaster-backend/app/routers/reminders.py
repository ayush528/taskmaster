"""Reminders router – /reminders endpoints."""

from __future__ import annotations

import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.reminder import ReminderCreate, ReminderOut
from app.services.reminder_service import (
    create_reminder,
    get_reminders_for_user,
    delete_reminder,
)

router = APIRouter(prefix="/reminders", tags=["reminders"])


@router.post("/", response_model=ReminderOut, status_code=status.HTTP_201_CREATED)
def create(
    payload: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_reminder(db, user_id=current_user.id, **payload.model_dump())


@router.get("/", response_model=List[ReminderOut])
def list_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_reminders_for_user(db, current_user.id)


@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(
    reminder_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ok = delete_reminder(db, reminder_id, current_user.id)
    if not ok:
        raise HTTPException(status_code=404, detail="Reminder not found")
