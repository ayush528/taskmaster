"""
AuthService – orchestrates registration, login, token refresh,
password changes, and token blacklisting.
"""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.recurring import UserPreference
from app.utils.password_utils import hash_password, verify_password, validate_password_strength
from app.utils.jwt_utils import (
    create_access_token,
    create_refresh_token,
    verify_access_token,
    verify_refresh_token,
)

logger = logging.getLogger("taskmaster.auth")

# ── In-memory token blacklist ────────────────────────────────────────
# In production, replace with Redis:
#   SET token 1 EX <remaining_ttl>
_blacklisted_tokens: set[str] = set()


def is_token_blacklisted(token: str) -> bool:
    return token in _blacklisted_tokens


def blacklist_token(token: str) -> None:
    _blacklisted_tokens.add(token)
    logger.info("Token blacklisted (logout)")


# ── AuthService class ────────────────────────────────────────────────


class AuthService:
    """Stateless auth operations that receive a DB session per call."""

    # ── Registration ──────────────────────────────────────────────────

    @staticmethod
    def register(
        db: Session,
        *,
        email: str,
        password: str,
        full_name: Optional[str] = None,
        user_timezone: Optional[str] = None,
    ) -> dict:
        """
        Create a new user account.

        Returns dict with user info + access/refresh tokens.
        Raises 409 if email already taken, 422 if password too weak.
        """
        # Password strength check
        validate_password_strength(password)

        # Uniqueness check
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

        user = User(
            email=email,
            password_hash=hash_password(password),
            full_name=full_name,
            timezone=user_timezone,
        )
        db.add(user)
        db.flush()

        # Create default preferences row
        prefs = UserPreference(user_id=user.id)
        db.add(prefs)
        db.commit()
        db.refresh(user)

        access = create_access_token(user.id)
        refresh = create_refresh_token(user.id)

        logger.info("User registered: %s (%s)", user.id, email)

        return {
            "user_id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "access_token": access,
            "refresh_token": refresh,
        }

    # ── Login ─────────────────────────────────────────────────────────

    @staticmethod
    def login(db: Session, *, email: str, password: str) -> dict:
        """
        Authenticate and return tokens.

        Raises 401 on bad credentials.
        """
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password_hash):
            logger.warning("Failed login attempt for %s", email)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        access = create_access_token(user.id)
        refresh = create_refresh_token(user.id)

        logger.info("User logged in: %s", user.id)

        return {
            "access_token": access,
            "refresh_token": refresh,
            "user_id": str(user.id),
            "email": user.email,
        }

    # ── Refresh ───────────────────────────────────────────────────────

    @staticmethod
    def refresh_access_token(refresh_token: str) -> dict:
        """
        Issue a new access token from a valid refresh token.

        Raises 401 if the refresh token is expired, invalid, or blacklisted.
        """
        if is_token_blacklisted(refresh_token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token has been revoked",
            )

        user_id = verify_refresh_token(refresh_token)  # raises 401 internally
        new_access = create_access_token(user_id)

        logger.info("Access token refreshed for user %s", user_id)
        return {"access_token": new_access}

    # ── Logout (blacklist) ────────────────────────────────────────────

    @staticmethod
    def logout(token: str) -> dict:
        blacklist_token(token)
        return {"message": "Logged out successfully"}

    # ── Change password ───────────────────────────────────────────────

    @staticmethod
    def change_password(
        db: Session,
        *,
        user: User,
        old_password: str,
        new_password: str,
    ) -> dict:
        if not verify_password(old_password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect",
            )

        validate_password_strength(new_password)

        user.password_hash = hash_password(new_password)
        db.commit()

        logger.info("Password changed for user %s", user.id)
        return {"message": "Password changed successfully"}

    # ── Profile helpers ───────────────────────────────────────────────

    @staticmethod
    def update_profile(
        db: Session,
        *,
        user: User,
        full_name: Optional[str] = None,
        user_timezone: Optional[str] = None,
    ) -> User:
        if full_name is not None:
            user.full_name = full_name
        if user_timezone is not None:
            user.timezone = user_timezone
        db.commit()
        db.refresh(user)

        logger.info("Profile updated for user %s", user.id)
        return user
