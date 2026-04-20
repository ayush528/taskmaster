"""Reminder CRUD service."""

from __future__ import annotations

import logging
import uuid
from typing import List

from sqlalchemy.orm import Session

from app.models.reminder import Reminder

logger = logging.getLogger(__name__)


def create_reminder(db: Session, user_id: uuid.UUID, **kwargs) -> Reminder:
    reminder = Reminder(user_id=user_id, **kwargs)
    db.add(reminder)
    db.commit()
    db.refresh(reminder)
    logger.info("Reminder %s created for task %s", reminder.id, reminder.task_id)
    return reminder


def get_reminders_for_user(db: Session, user_id: uuid.UUID) -> List[Reminder]:
    return (
        db.query(Reminder)
        .filter(Reminder.user_id == user_id, Reminder.is_sent == False)
        .order_by(Reminder.scheduled_time.asc())
        .all()
    )


def delete_reminder(db: Session, reminder_id: uuid.UUID, user_id: uuid.UUID) -> bool:
    r = db.query(Reminder).filter(Reminder.id == reminder_id, Reminder.user_id == user_id).first()
    if not r:
        return False
    db.delete(r)
    db.commit()
    return True
