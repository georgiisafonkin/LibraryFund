from typing import List
from fastapi import APIRouter, Depends, Query
from src.app.db.db import get_db
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date

from src.app.domain.models.edition.edition import Edition
from src.app.domain.models.copy.copy import Copy
from src.app.domain.models.edition.edition_inventory import EditionInventory
from src.app.infrastructure.repositories.literature_repo import LiteratureRepository

literature_router = APIRouter(prefix="/literature", tags=["literature"])

@literature_router.get("/inventory/operations", response_model=List[EditionInventory])
async def get_inventory_operations(
    start_date: date = Query(...),
    end_date: date = Query(...),
    db: AsyncSession = Depends(get_db)
):
    repo = LiteratureRepository(db)
    result = await repo.get_inventory_operations_by_date_range(start_date, end_date)
    return [EditionInventory(**row) for row in result]


@literature_router.get("/copies/by-work-title", response_model=List[Copy])
async def get_inventory_numbers_by_work_title(
    title: str = Query(..., description="Название произведения"),
    db: AsyncSession = Depends(get_db)
):
    repo = LiteratureRepository(db)
    copies = await repo.get_inventory_numbers_by_work_title(title)
    return [Copy(**row) for row in copies]


@literature_router.get("/copies/by-author", response_model=List[Copy])
async def get_copies_by_author(
    author_name: str = Query(..., description="ФИО автора"),
    db: AsyncSession = Depends(get_db)
):
    repo = LiteratureRepository(db)
    copies = await repo.get_copies_by_author(author_name)
    return [Copy(**row) for row in copies]
