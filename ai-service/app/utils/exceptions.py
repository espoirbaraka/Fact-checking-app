class AppException(Exception):
    def __init__(self, message: str, status_code: int = 500) -> None:
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class NotFoundError(AppException):
    def __init__(self, message: str = "Resource not found") -> None:
        super().__init__(message=message, status_code=404)


class ValidationError(AppException):
    def __init__(self, message: str = "Validation error") -> None:
        super().__init__(message=message, status_code=422)


class ExternalServiceError(AppException):
    def __init__(self, message: str, status_code: int = 502) -> None:
        super().__init__(message=message, status_code=status_code)
