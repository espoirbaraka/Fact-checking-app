import io
from typing import Any

from app.core.logging import get_logger
from app.utils.exceptions import ValidationError

logger = get_logger(__name__)

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".tif", ".tiff", ".bmp"}
ALLOWED_MIME_PREFIXES = ("image/", "application/pdf")
MAX_FILE_BYTES = 12 * 1024 * 1024  # 12 Mo
MAX_PDF_PAGES = 8
MAX_TEXT_CHARS = 8000


class DocumentExtractService:
    """Extract text from PDF (native + OCR fallback) and images (Tesseract OCR)."""

    def extract(self, filename: str, content: bytes, content_type: str | None = None) -> dict[str, Any]:
        if not content:
            raise ValidationError("Fichier vide.")
        if len(content) > MAX_FILE_BYTES:
            raise ValidationError("Fichier trop volumineux (max 12 Mo).")

        name = (filename or "document").strip() or "document"
        lower = name.lower()
        ext = self._extension(lower)
        mime = (content_type or "").lower()

        if ext not in ALLOWED_EXTENSIONS and not any(mime.startswith(p) for p in ALLOWED_MIME_PREFIXES):
            raise ValidationError(
                "Format non supporté. Utilisez PDF, PNG, JPG, WEBP ou GIF."
            )

        if ext == ".pdf" or mime == "application/pdf":
            text, method = self._extract_pdf(content)
        else:
            text, method = self._extract_image(content)

        text = self._normalize_text(text)
        if not text:
            raise ValidationError(
                "Impossible d'extraire du texte de ce fichier "
                "(image illisible, PDF vide ou OCR indisponible)."
            )

        truncated = False
        if len(text) > MAX_TEXT_CHARS:
            text = text[:MAX_TEXT_CHARS].rstrip() + "…"
            truncated = True

        return {
            "filename": name,
            "text": text,
            "method": method,
            "truncated": truncated,
            "char_count": len(text),
        }

    def build_fact_check_message(
        self,
        extracted_text: str,
        filename: str,
        user_message: str | None = None,
    ) -> str:
        user_part = (user_message or "").strip()
        header = (
            f"Document joint: {filename}\n"
            f"Texte extrait (OCR / PDF):\n"
            f"---\n{extracted_text}\n---\n"
        )
        if user_part:
            return (
                f"{header}\n"
                f"Question / affirmation de l'utilisateur à vérifier "
                f"en te basant sur le document et tes recherches:\n{user_part}"
            )
        return (
            f"{header}\n"
            "Identifie l'affirmation principale contenue dans ce document "
            "et vérifie si elle est vraie ou fausse."
        )

    def _extract_pdf(self, content: bytes) -> tuple[str, str]:
        try:
            import fitz  # PyMuPDF
        except ImportError as exc:
            raise ValidationError(
                "Extraction PDF indisponible (PyMuPDF non installé)."
            ) from exc

        try:
            doc = fitz.open(stream=content, filetype="pdf")
        except Exception as exc:
            raise ValidationError(f"PDF invalide: {exc}") from exc

        try:
            page_count = min(len(doc), MAX_PDF_PAGES)
            native_parts: list[str] = []
            for index in range(page_count):
                page_text = doc.load_page(index).get_text("text") or ""
                if page_text.strip():
                    native_parts.append(page_text.strip())

            native_text = "\n\n".join(native_parts).strip()
            # Prefer native selectable text whenever present
            if len(native_text) >= 20:
                return native_text, "pdf_text"

            # Scanned / nearly empty PDF → OCR page images
            ocr_parts: list[str] = []
            ocr_error: Exception | None = None
            for index in range(page_count):
                page = doc.load_page(index)
                pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
                png_bytes = pix.tobytes("png")
                try:
                    page_ocr, _ = self._extract_image(png_bytes)
                except Exception as exc:  # noqa: BLE001 - fall back to native if any
                    ocr_error = exc
                    logger.warning(
                        "PDF page OCR failed",
                        extra={"page": index, "error": str(exc)},
                    )
                    continue
                if page_ocr:
                    ocr_parts.append(page_ocr)

            ocr_text = "\n\n".join(ocr_parts).strip()
            if ocr_text:
                return ocr_text, "pdf_ocr"
            if native_text:
                return native_text, "pdf_text"
            if ocr_error is not None:
                raise ocr_error
            return "", "pdf_empty"
        finally:
            doc.close()

    def _extract_image(self, content: bytes) -> tuple[str, str]:
        try:
            from PIL import Image
            import pytesseract
        except ImportError as exc:
            raise ValidationError(
                "OCR indisponible (Pillow / pytesseract non installés)."
            ) from exc

        try:
            image = Image.open(io.BytesIO(content))
            if image.mode not in ("RGB", "L"):
                image = image.convert("RGB")
        except Exception as exc:
            raise ValidationError(f"Image invalide: {exc}") from exc

        try:
            text = pytesseract.image_to_string(image, lang="fra+eng")
        except pytesseract.TesseractNotFoundError as exc:
            logger.error("Tesseract binary not found")
            raise ValidationError(
                "Tesseract OCR n'est pas installé sur le serveur. "
                "Reconstruisez le conteneur ai-service."
            ) from exc
        except Exception as primary_exc:
            # Fallback if French pack missing or other lang issue
            try:
                logger.warning(
                    "OCR fra+eng failed, retrying with eng",
                    extra={"error": str(primary_exc)},
                )
                text = pytesseract.image_to_string(image, lang="eng")
            except Exception as exc:
                logger.warning("OCR failed", extra={"error": str(exc)})
                raise ValidationError(f"Échec OCR: {exc}") from exc

        return (text or "").strip(), "ocr"

    @staticmethod
    def _extension(filename: str) -> str:
        if "." not in filename:
            return ""
        return "." + filename.rsplit(".", 1)[-1].lower()

    @staticmethod
    def _normalize_text(text: str) -> str:
        lines = [line.strip() for line in (text or "").splitlines()]
        collapsed = "\n".join(line for line in lines if line)
        return "\n".join(
            line for line in collapsed.splitlines() if line.strip()
        ).strip()
