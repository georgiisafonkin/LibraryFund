from typing import List
from fastapi import APIRouter, Depends, Query
from src.app.db.db import get_db
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date

from src.app.domain.models.edition.edition import Edition
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
