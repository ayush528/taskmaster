"""Lightweight input validation helpers."""

from __future__ import annotations

import re


def is_valid_hex_color(value: str) -> bool:
    return bool(re.fullmatch(r"#[0-9a-fA-F]{6}", value))


def clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))
