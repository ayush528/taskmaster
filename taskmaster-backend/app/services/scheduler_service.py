"""Scheduler service – recurring task instance generation."""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.models.task import Task
from app.models.recurring import RecurringRule, RecurringFreqEnum

logger = logging.getLogger(__name__)


def _next_date(current: datetime, rule: RecurringRule) -> datetime | None:
    interval = rule.interval or 1

    if rule.frequency == RecurringFreqEnum.DAILY:
        return current + timedelta(days=interval)
    elif rule.frequency == RecurringFreqEnum.WEEKLY:
        return current + timedelta(weeks=interval)
    elif rule.frequency == RecurringFreqEnum.BIWEEKLY:
        return current + timedelta(weeks=2 * interval)
    elif rule.frequency == RecurringFreqEnum.MONTHLY:
        month = current.month + interval
        year = current.year + (month - 1) // 12
        month = (month - 1) % 12 + 1
        day = min(current.day, 28)  # simplistic month handling
        return current.replace(year=year, month=month, day=day)
    return None


def generate_next_instance(db: Session, rule: RecurringRule) -> Task | None:
    """Create the next task instance for a recurring rule and advance next_occurrence."""
    original = db.query(Task).filter(Task.id == rule.original_task_id).first()
    if not original:
        logger.warning("Original task %s not found for rule %s", rule.original_task_id, rule.id)
        return None

    # Check limits
    if rule.end_date and rule.next_occurrence > rule.end_date:
        logger.info("Recurring rule %s past end date – skipping", rule.id)
        return None

    new_task = Task(
        user_id=original.user_id,
        project_id=original.project_id,
        title=original.title,
        description=original.description,
        priority=original.priority,
        due_date=rule.next_occurrence,
        estimated_hours=original.estimated_hours,
        assigned_to=original.assigned_to,
        parent_task_id=original.id,
        tags=original.tags,
    )
    db.add(new_task)

    # Advance to next
    nxt = _next_date(rule.next_occurrence, rule)
    if nxt:
        rule.next_occurrence = nxt
    db.commit()
    db.refresh(new_task)

    logger.info("Generated recurring instance %s from rule %s", new_task.id, rule.id)
    return new_task
