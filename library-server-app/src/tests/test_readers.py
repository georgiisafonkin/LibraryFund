import pytest
from httpx import AsyncClient
from asgi_lifespan import LifespanManager
from fastapi import FastAPI
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from src.main import app  #  FastAPI instance
from src.app.db.db import get_db, async_engine, AsyncSessionLocal

# Пример валидных данных для каждого читателя
reader_payloads = {
    "student": {
        "name": "Иван Иванов",
        "birth_date": "2000-01-01",
        "library_id": 1,
        "university": "МГУ",
        "faculty": "Физфак",
        "course": "2",
        "group_number": 101
    },
    "scientist": {
        "name": "Алексей Алексеев",
        "birth_date": "1980-05-20",
        "library_id": 2,
        "organization": "НИИ РАН",
        "experience": 15
    },
    "teacher": {
        "name": "Мария Петрова",
        "birth_date": "1975-09-10",
        "library_id": 3,
        "subject": "Математика",
        "school_addr": "Школа №42, ул. Учительская, 3"
    },
    "schoolboy": {
        "name": "Коля Сидоров",
        "birth_date": "2010-04-15",
        "library_id": 4,
        "school_addr": "Школа №7, ул. Молодежная, 5",
        "school_class": 5
    },
    "worker": {
        "name": "Сергей Миронов",
        "birth_date": "1990-03-22",
        "library_id": 5,
        "organization": "Завод 'Труд'",
        "position": "Инженер"
    },
    "retiree": {
        "name": "Галина Смирнова",
        "birth_date": "1950-11-11",
        "library_id": 6,
        "organization": "Мосгаз",
        "experience": 40
    }
}

# Асинхронная фикстура для клиента
@pytest.fixture
async def async_client():
    async with LifespanManager(app):
        async with AsyncClient(app=app, base_url="http://testserver") as client:
            yield client

# Фикстура для очистки базы данных перед каждым тестом (упрощённо)
@pytest.fixture(autouse=True)
async def setup_db():
    # async with async_engine.begin() as conn:
        # await conn.execute(text("TRUNCATE reader CASCADE"))  # если есть таблица `readers`
    yield get_db

# Генератор тестов для всех типов читателей
@pytest.mark.parametrize("reader_type", [
    "student", "scientist", "teacher", "schoolboy", "worker", "retiree"
])
@pytest.mark.asyncio
async def test_create_reader(reader_type: str, async_client: AsyncClient):
    payload = reader_payloads[reader_type]
    response = await async_client.post(f"/reader/{reader_type}", json=payload)

    assert response.status_code == 200, response.text
    assert "reader_id" in response.json()
