"""
JWT token creation, decoding, and validation utilities.

Supports two token types:
  - access  : short-lived (24 h default), signed with SECRET_KEY
  - refresh : long-lived  (7 d default),  signed with REFRESH_SECRET_KEY
"""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from fastapi import HTTPException, status
from jose import ExpiredSignatureError, JWTError, jwt

from app.config import get_settings

logger = logging.getLogger("taskmaster.jwt")
settings = get_settings()


# ── Token types ───────────────────────────────────────────────────────

TOKEN_TYPE_ACCESS = "access"
TOKEN_TYPE_REFRESH = "refresh"


# ── Create ────────────────────────────────────────────────────────────

def create_jwt_token(
    data: Dict[str, Any],
    expires_delta: timedelta,
    secret: Optional[str] = None,
) -> str:
    """Encode a JWT with the supplied payload and expiry."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire, "iat": datetime.now(timezone.utc)})
    return jwt.encode(
        to_encode,
        secret or settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def create_access_token(user_id: uuid.UUID, expires_in_hours: int | None = None) -> str:
    hours = expires_in_hours or settings.ACCESS_TOKEN_EXPIRE_HOURS
    return create_jwt_token(
        data={"sub": str(user_id), "type": TOKEN_TYPE_ACCESS},
        expires_delta=timedelta(hours=hours),
        secret=settings.SECRET_KEY,
    )


def create_refresh_token(user_id: uuid.UUID) -> str:
    return create_jwt_token(
        data={"sub": str(user_id), "type": TOKEN_TYPE_REFRESH},
        expires_delta=timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        secret=settings.REFRESH_SECRET_KEY,
    )


# ── Decode / verify ──────────────────────────────────────────────────

def decode_jwt_token(
    token: str,
    secret: Optional[str] = None,
    expected_type: str = TOKEN_TYPE_ACCESS,
) -> Dict[str, Any]:
    """
    Decode and validate a JWT.

    Raises HTTPException(401) on:
      - expired token
      - invalid signature / format
      - wrong token type (access vs. refresh)
    """
    try:
        payload = jwt.decode(
            token,
            secret or settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
    except ExpiredSignatureError:
        logger.warning("Expired %s token presented", expected_type)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError as exc:
        logger.warning("Invalid token: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify token type
    token_type = payload.get("type")
    if token_type != expected_type:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Expected {expected_type} token, got {token_type}",
        )

    sub = payload.get("sub")
    if sub is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing subject",
        )

    return payload


def verify_access_token(token: str) -> uuid.UUID:
    """Convenience wrapper — decode an access token, return user_id."""
    payload = decode_jwt_token(token, secret=settings.SECRET_KEY, expected_type=TOKEN_TYPE_ACCESS)
    return uuid.UUID(payload["sub"])


def verify_refresh_token(token: str) -> uuid.UUID:
    """Decode a refresh token, return user_id."""
    payload = decode_jwt_token(token, secret=settings.REFRESH_SECRET_KEY, expected_type=TOKEN_TYPE_REFRESH)
    return uuid.UUID(payload["sub"])
