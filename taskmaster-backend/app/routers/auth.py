"""
Auth router – /auth endpoints.

Endpoints:
  POST /auth/register          – create account, return tokens
  POST /auth/login             – authenticate, return tokens
  POST /auth/refresh           – exchange refresh token for new access token
  POST /auth/logout            – blacklist the current access token
  GET  /auth/me                – return authenticated user's profile
  PUT  /auth/profile           – update full_name / timezone
  POST /auth/change-password   – change password (requires old password)
"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])
auth = AuthService()


# ── Request / Response schemas (co-located for clarity) ──────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None
    timezone: Optional[str] = None


class RegisterResponse(BaseModel):
    user_id: str
    email: str
    full_name: Optional[str]
    access_token: str
    refresh_token: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    user_id: str
    email: str


class RefreshRequest(BaseModel):
    refresh_token: str


class RefreshResponse(BaseModel):
    access_token: str


class MessageResponse(BaseModel):
    message: str


class MeResponse(BaseModel):
    user_id: str
    email: str
    full_name: Optional[str]
    timezone: Optional[str]
    created_at: str

    model_config = {"from_attributes": True}


class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    timezone: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=8)


# ── Endpoints ────────────────────────────────────────────────────────

@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new user account",
)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    result = auth.register(
        db,
        email=payload.email,
        password=payload.password,
        full_name=payload.full_name,
        user_timezone=payload.timezone,
    )
    return result


@router.post(
    "/login",
    response_model=LoginResponse,
    summary="Authenticate and receive tokens",
)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    return auth.login(db, email=payload.email, password=payload.password)


@router.post(
    "/refresh",
    response_model=RefreshResponse,
    summary="Exchange refresh token for a new access token",
)
def refresh(payload: RefreshRequest):
    return auth.refresh_access_token(payload.refresh_token)


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Blacklist the current access token",
)
def logout(request: Request, current_user: User = Depends(get_current_user)):
    # Extract raw token from the Authorization header
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "") if auth_header.startswith("Bearer ") else ""
    return auth.logout(token)


@router.get(
    "/me",
    response_model=MeResponse,
    summary="Get current user's profile",
)
def me(current_user: User = Depends(get_current_user)):
    return MeResponse(
        user_id=str(current_user.id),
        email=current_user.email,
        full_name=current_user.full_name,
        timezone=current_user.timezone,
        created_at=current_user.created_at.isoformat(),
    )


@router.put(
    "/profile",
    response_model=MeResponse,
    summary="Update profile fields (full_name, timezone)",
)
def update_profile(
    payload: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    updated = auth.update_profile(
        db,
        user=current_user,
        full_name=payload.full_name,
        user_timezone=payload.timezone,
    )
    return MeResponse(
        user_id=str(updated.id),
        email=updated.email,
        full_name=updated.full_name,
        timezone=updated.timezone,
        created_at=updated.created_at.isoformat(),
    )


@router.post(
    "/change-password",
    response_model=MessageResponse,
    summary="Change password (requires current password)",
)
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return auth.change_password(
        db,
        user=current_user,
        old_password=payload.old_password,
        new_password=payload.new_password,
    )
