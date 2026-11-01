from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="allow")

    PROJECT_NAME: str = "PlantCare AI"
    VERSION: str = "1.0.0-alpha"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "super_secret_plantcare_development_key_change_in_prod"

    # CORS configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    # Database URL: Async SQLite fallback for zero-setup local dev, or Supabase PostgreSQL
    DATABASE_URL: str = "sqlite+aiosqlite:///./plantcare.db"

    # Telegram Bot Settings
    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_DEFAULT_CHAT_ID: str = ""
    TELEGRAM_ALERTS_ENABLED: bool = True
    TELEGRAM_NOTIFICATION_COOLDOWN_MINUTES: int = 60

    # ESP32 Security
    ESP32_API_SECRET_KEY: str = "esp_plantcare_shared_secret_development"

    # Simulation engine
    SIMULATION_ENABLED: bool = True
    SIMULATION_UPDATE_INTERVAL_SECONDS: int = 6

settings = Settings()
