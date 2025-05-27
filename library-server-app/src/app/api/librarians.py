from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from src.app.db.db import get_db
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date

from src.app.domain.models.librarian import *
from src.app.infrastructure.repositories.librarian_repo import LibrarianRepository

librarian_router = APIRouter(prefix="/librarians", tags=["librarians"])

@librarian_router.get("/reader-counts", response_model=List[dict])
async def get_librarian_reader_counts(
    start_date: date = Query(...),
    end_date: date = Query(...),
    db: AsyncSession = Depends(get_db)
):
    repo = LibrarianRepository(db)
    return await repo.get_librarians_with_reader_counts(start_date, end_date)