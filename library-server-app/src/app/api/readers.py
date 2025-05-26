from fastapi import APIRouter, Depends
from src.app.db.db import get_db
from sqlalchemy.orm import Session

from src.app.domain.models import *
from src.app.infrastructure.repositories.reader_repo import ReaderRepository

reader_router = APIRouter(prefix="/readers", tags=["readers"])

@reader_router.get("/readers")
def list_readers(service):
    pass

@reader_router.post("/student")
async def create_student(reader: Student, db: Session = Depends(get_db)):
    repo = ReaderRepository(db)
    reader_id = await repo.create_student(**reader.model_dump())
    return {"reader_id": reader_id}


@reader_router.post("/scientist")
async def create_scientist(reader: Scientist, db: Session = Depends(get_db)):
    repo = ReaderRepository(db)
    reader_id = await repo.create_scientist(**reader.model_dump())
    return {"reader_id": reader_id}


@reader_router.post("/teacher")
async def create_teacher(reader: Teacher, db: Session = Depends(get_db)):
    repo = ReaderRepository(db)
    reader_id = await repo.create_teacher(**reader.model_dump())
    return {"reader_id": reader_id}


@reader_router.post("/schoolboy")
async def create_schoolboy(reader: Schoolboy, db: Session = Depends(get_db)):
    repo = ReaderRepository(db)
    reader_id = await repo.create_schoolboy(**reader.model_dump())
    return {"reader_id": reader_id}


@reader_router.post("/worker")
async def create_worker(reader: WorkerReader, db: Session = Depends(get_db)):
    repo = ReaderRepository(db)
    reader_id = await repo.create_worker(**reader.model_dump())
    return {"reader_id": reader_id}


@reader_router.post("/retiree")
async def create_retiree(reader: Retiree, db: Session = Depends(get_db)):
    repo = ReaderRepository(db)
    reader_id = await repo.create_retiree(**reader.model_dump())
    return {"reader_id": reader_id}