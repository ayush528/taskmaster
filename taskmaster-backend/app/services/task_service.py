"""Task CRUD and business logic."""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.task import Task, StatusEnum
from app.models.recurring import TaskHistory

logger = logging.getLogger(__name__)


def create_task(db: Session, user_id: uuid.UUID, **kwargs) -> Task:
    task = Task(user_id=user_id, **kwargs)
    db.add(task)
    db.commit()
    db.refresh(task)
    logger.info("Task %s created by user %s", task.id, user_id)
    return task


def get_tasks(
    db: Session,
    user_id: uuid.UUID,
    *,
    status: Optional[StatusEnum] = None,
    project_id: Optional[uuid.UUID] = None,
    priority: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
) -> List[Task]:
    q = db.query(Task).filter(Task.user_id == user_id)
    if status:
        q = q.filter(Task.status == status)
    if project_id:
        q = q.filter(Task.project_id == project_id)
    if priority:
        q = q.filter(Task.priority == priority)
    return q.order_by(Task.due_date.asc().nullslast()).offset(offset).limit(limit).all()


def get_task_by_id(db: Session, task_id: uuid.UUID, user_id: uuid.UUID) -> Task | None:
    return (
        db.query(Task)
        .filter(Task.id == task_id, Task.user_id == user_id)
        .first()
    )


def update_task(
    db: Session,
    task: Task,
    user_id: uuid.UUID,
    **updates,
) -> Task:
    old_status = task.status
    for key, value in updates.items():
        if value is not None:
            setattr(task, key, value)

    # Auto-set completed_at
    if "status" in updates and updates["status"] == StatusEnum.COMPLETED:
        task.completed_at = datetime.now(timezone.utc)

    # Record history
    if "status" in updates and updates["status"] != old_status:
        history = TaskHistory(
            task_id=task.id,
            status_changed_from=old_status.value if old_status else "",
            status_changed_to=updates["status"].value,
            changed_by=user_id,
        )
        db.add(history)

    db.commit()
    db.refresh(task)
    logger.info("Task %s updated", task.id)
    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()
    logger.info("Task %s deleted", task.id)
