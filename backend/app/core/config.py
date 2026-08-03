from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SecureShare API"
    SECRET_KEY: str
    DATABASE_URL: str
    ALGORITHM: str = "HS256"
    TOKEN_EXPIRY: int = 30 # minutes

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
