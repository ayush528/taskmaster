"""AI router – /ai endpoints for LLM-powered features."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.services import task_service, ai_service

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/breakdown/{task_id}")
async def breakdown(
    task_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = task_service.get_task_by_id(db, task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    result = await ai_service.breakdown_task(db, task, current_user.id)
    return {"breakdown": result}


@router.post("/suggest-priority/{task_id}")
async def suggest_priority(
    task_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = task_service.get_task_by_id(db, task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    suggestion = await ai_service.suggest_priority(db, task, current_user.id)
    return {"suggested_priority": suggestion}
