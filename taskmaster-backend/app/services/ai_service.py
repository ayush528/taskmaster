"""AI service – OpenRouter / LLM integration for task intelligence."""

from __future__ import annotations

import logging
import uuid
from typing import Any, Dict

import httpx
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.recurring import AIRequestLog, AIRequestTypeEnum
from app.models.task import Task

logger = logging.getLogger(__name__)
settings = get_settings()

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


async def _call_llm(messages: list[dict], model: str = "openai/gpt-4o") -> Dict[str, Any]:
    """Low-level call to OpenRouter."""
    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {"model": model, "messages": messages}

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(OPENROUTER_URL, json=payload, headers=headers)
        resp.raise_for_status()
        return resp.json()


async def breakdown_task(
    db: Session,
    task: Task,
    user_id: uuid.UUID,
) -> dict:
    """Ask the LLM to break a task into subtasks + suggestions."""
    messages = [
        {
            "role": "system",
            "content": (
                "You are a productivity assistant. "
                "Break the following task into actionable subtasks and offer suggestions. "
                "Return JSON: {\"subtasks\": [...], \"suggestions\": [...]}"
            ),
        },
        {
            "role": "user",
            "content": f"Task: {task.title}\nDescription: {task.description or 'N/A'}\nPriority: {task.priority.value}",
        },
    ]

    result = await _call_llm(messages)
    usage = result.get("usage", {})
    content = result["choices"][0]["message"]["content"]

    # Log the request
    log = AIRequestLog(
        user_id=user_id,
        task_id=task.id,
        request_type=AIRequestTypeEnum.BREAKDOWN,
        input_tokens=usage.get("prompt_tokens", 0),
        output_tokens=usage.get("completion_tokens", 0),
        model_used=result.get("model", "openai/gpt-4o"),
        cost=0.0,
    )
    db.add(log)

    # Persist breakdown on the task
    import json
    try:
        breakdown = json.loads(content)
    except json.JSONDecodeError:
        breakdown = {"raw": content}

    task.ai_breakdown = breakdown
    db.commit()

    logger.info("AI breakdown for task %s completed", task.id)
    return breakdown


async def suggest_priority(
    db: Session,
    task: Task,
    user_id: uuid.UUID,
) -> str:
    """Ask the LLM to suggest a priority level."""
    messages = [
        {
            "role": "system",
            "content": (
                "Given a task title, description, and due date, suggest one of: "
                "URGENT, HIGH, NORMAL, LOW. Reply with ONLY the priority word."
            ),
        },
        {
            "role": "user",
            "content": f"Title: {task.title}\nDescription: {task.description or ''}\nDue: {task.due_date}",
        },
    ]

    result = await _call_llm(messages)
    usage = result.get("usage", {})
    suggestion = result["choices"][0]["message"]["content"].strip().upper()

    log = AIRequestLog(
        user_id=user_id,
        task_id=task.id,
        request_type=AIRequestTypeEnum.PRIORITIZE,
        input_tokens=usage.get("prompt_tokens", 0),
        output_tokens=usage.get("completion_tokens", 0),
        model_used=result.get("model", "openai/gpt-4o"),
        cost=0.0,
    )
    db.add(log)
    db.commit()

    logger.info("AI priority suggestion for task %s: %s", task.id, suggestion)
    return suggestion
