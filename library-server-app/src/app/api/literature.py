from typing import List
from fastapi import APIRouter, Depends, Query
from src.app.db.db import get_db
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date

from src.app.domain.models.edition.edition import Edition
from src.app.domain.models.copy.copy import Copy
from src.app.domain.models.work.work_loancount import WorkLoanCount
from src.app.domain.models.edition.edition_inventory import EditionInventory
from src.app.infrastructure.repositories.literature_repo import LiteratureRepository

literature_router = APIRouter(prefix="/literature", tags=["literature"])

@literature_router.get("/loaned-editions", response_model=List[Edition])
async def get_loaned_editions_by_reader(
    reader_id: int = Query(...),
    start_date: date = Query(...),
    end_date: date = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Выдать список изданий,
    которые в течение некоторого времени получал указанный читатель из фонда библиотеки,
    где он зарегистрирован
    
    """
    repo = LiteratureRepository(db)
    titles = await repo.get_loaned_editions_by_reader_and_date_range(reader_id, start_date, end_date)
    return titles

@literature_router.get("/foreign-loans", response_model=List[Edition])
async def get_foreign_library_loans(
    reader_id: int = Query(...),
    start_date: date = Query(...),
    end_date: date = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Получить перечень изданий,
    которыми в течение некоторого времени пользовался указанный читатель из фонда библиотеки,
    где он не зарегистрирован

    """
    repo = LiteratureRepository(db)
    titles = await repo.get_foreign_library_loans(reader_id, start_date, end_date)
    return titles


@literature_router.get("/unreturned-titles-by-shelf", response_model=List[Edition])
async def get_unreturned_titles_by_shelf(
    shelf_id: int = Query(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Получить список литературы, которая в настоящий момент выдана с определенной полки некоторой библиотеки.
    
    """
    repo = LiteratureRepository(db)
    return await repo.get_unreturned_titles_by_shelf(shelf_id)

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


@literature_router.get("/works/top-loaned", response_model=List[WorkLoanCount])
async def get_top_loaned_works(
    limit: int = Query(10, gt=0, le=100, description="Количество записей в топе"),
    db: AsyncSession = Depends(get_db)
):
    repo = LiteratureRepository(db)
    return await repo.get_top_loaned_works(limit)
