"""
Shared FastAPI dependencies.

- get_db:           yields a SQLAlchemy session per request
- get_current_user: extracts Bearer token → verifies → returns User ORM object
"""

from __future__ import annotations

import logging
from typing import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db as _raw_get_db          # re-export under same name
from app.models.user import User
from app.utils.jwt_utils import verify_access_token
from app.services.auth_service import is_token_blacklisted

logger = logging.getLogger("taskmaster.deps")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# Re-export so routers can do `Depends(get_db)`
def get_db() -> Generator:
    yield from _raw_get_db()


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Resolve the authenticated user from the Authorization header.

    Flow:
      1. Extract Bearer token
      2. Check blacklist (logout)
      3. Decode & verify JWT  (raises 401 on expiry / invalid)
      4. Fetch User row       (raises 401 if deleted)
    """
    # 1. Blacklist check
    if is_token_blacklisted(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked (logged out)",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. Verify JWT – raises 401 internally on failure
    user_id = verify_access_token(token)

    # 3. DB lookup
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        logger.warning("Token valid but user %s not found in DB", user_id)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
