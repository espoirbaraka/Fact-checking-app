"""Language helpers for multilingual AI answers."""

LANGUAGE_NAMES: dict[str, str] = {
    "fr": "français",
    "en": "English",
    "sw": "Kiswahili",
    "ln": "Lingala",
    "lua": "Tshiluba",
    "kg": "Kikongo",
    "rw": "Ikinyarwanda",
    "nnb": "Kinande",
    "huu": "Kihunde",
    "shr": "Mashi (Shi)",
}

OUI_NON_LABELS: dict[str, tuple[str, str]] = {
    "fr": ("Oui", "Non"),
    "en": ("Yes", "No"),
    "sw": ("Ndiyo", "Hapana"),
    "ln": ("Iyo", "Te"),
    "lua": ("Eyo", "To"),
    "kg": ("Inga", "Ve"),
    "rw": ("Yego", "Oya"),
    "nnb": ("Ego", "Iha"),
    "huu": ("Ego", "Nanga"),
    "shr": ("Yego", "Ndaha"),
}


def normalize_language(code: str | None) -> str:
    if not code:
        return "fr"
    value = code.strip().lower()
    return value if value in LANGUAGE_NAMES else "fr"


def language_display_name(code: str | None) -> str:
    return LANGUAGE_NAMES[normalize_language(code)]


def verdict_labels(code: str | None) -> tuple[str, str]:
    return OUI_NON_LABELS[normalize_language(code)]
