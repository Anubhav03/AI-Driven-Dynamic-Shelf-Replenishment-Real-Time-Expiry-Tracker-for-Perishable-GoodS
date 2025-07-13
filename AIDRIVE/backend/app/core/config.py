from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # Database Configuration - MySQL Only
    DATABASE_TYPE: str = "mysql"  # Only MySQL is supported now
    DATABASE_URL: str = "mysql+pymysql://root:january2023@localhost:3306/shelf_management"  # Will be constructed from MySQL settings
    
    # MySQL Configuration
    MYSQL_HOST: str = "localhost"
    MYSQL_PORT: int = 3306
    MYSQL_USER: str = "root"
    MYSQL_PASSWORD: str = "january2023"
    MYSQL_DATABASE: str = "shelf_management"
    
    # Other settings
    SECRET_KEY: str = "supersecret"
    DEBUG: bool = True

    @property
    def get_database_url(self) -> str:
        return f"mysql+pymysql://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"

    class Config:
        env_file = ".env"

settings = Settings()
