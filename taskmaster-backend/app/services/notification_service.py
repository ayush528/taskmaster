"""Notification service – email / SMS / push stubs."""

from __future__ import annotations

import logging

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


async def send_email(to: str, subject: str, body: str) -> bool:
    """Stub: integrate SendGrid here."""
    if not settings.SENDGRID_API_KEY:
        logger.warning("SENDGRID_API_KEY not configured – email skipped")
        return False
    # TODO: httpx call to SendGrid API
    logger.info("Email sent to %s: %s", to, subject)
    return True


async def send_sms(to_phone: str, message: str) -> bool:
    """Stub: integrate Twilio here."""
    if not settings.TWILIO_ACCOUNT_SID:
        logger.warning("Twilio not configured – SMS skipped")
        return False
    # TODO: Twilio client call
    logger.info("SMS sent to %s", to_phone)
    return True
