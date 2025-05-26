from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from src.app.db.db import get_db
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession

from src.app.domain.models import *
from src.app.infrastructure.repositories.reader_repo import ReaderRepository

reader_router = APIRouter(prefix="/readers", tags=["readers"])

@reader_router.get("/readers")
def list_readers(service):
    pass

@reader_router.post("/student")
async def create_student(reader: Student, db: AsyncSession = Depends(get_db)):
    repo = ReaderRepository(db)
    reader_id = await repo.create_student(**reader.model_dump())
    return {"reader_id": reader_id}


@reader_router.post("/scientist")
async def create_scientist(reader: Scientist, db: AsyncSession = Depends(get_db)):
    repo = ReaderRepository(db)
    reader_id = await repo.create_scientist(**reader.model_dump())
    return {"reader_id": reader_id}


@reader_router.post("/teacher")
async def create_teacher(reader: Teacher, db: AsyncSession = Depends(get_db)):
    repo = ReaderRepository(db)
    reader_id = await repo.create_teacher(**reader.model_dump())
    return {"reader_id": reader_id}


@reader_router.post("/schoolboy")
async def create_schoolboy(reader: Schoolboy, db: AsyncSession = Depends(get_db)):
    repo = ReaderRepository(db)
    reader_id = await repo.create_schoolboy(**reader.model_dump())
    return {"reader_id": reader_id}


@reader_router.post("/worker")
async def create_worker(reader: WorkerReader, db: AsyncSession = Depends(get_db)):
    repo = ReaderRepository(db)
    reader_id = await repo.create_worker(**reader.model_dump())
    return {"reader_id": reader_id}


@reader_router.post("/retiree")
async def create_retiree(reader: Retiree, db: AsyncSession = Depends(get_db)):
    repo = ReaderRepository(db)
    reader_id = await repo.create_retiree(**reader.model_dump())
    return {"reader_id": reader_id}


@reader_router.get("/students")
async def get_students(
    university: Optional[str] = Query(default=None),
    faculty: Optional[str] = Query(default=None),
    course: Optional[str] = Query(default=None),
    group_number: Optional[int] = Query(default=None),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    students = await repo.get_students(university, faculty, course, group_number)
    return {"data": [dict(student) for student in students]}


@reader_router.get("/scientists")
async def get_scientists(
    organization: Optional[str] = Query(None),
    research_topic: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    scientists = await repo.get_scientists(organization, research_topic)
    return {"data": [dict(row) for row in scientists]}

@reader_router.get("/teachers")
async def get_teachers(
    subject: Optional[str] = Query(None),
    school_addr: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    teachers = await repo.get_teachers(subject, school_addr)
    return {"data": [dict(row) for row in teachers]}

@reader_router.get("/schoolboys")
async def get_schoolboys(
    school_addr: Optional[str] = Query(None),
    school_class: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    schoolboys = await repo.get_schoolboys(school_addr, school_class)
    return {"data": [dict(row) for row in schoolboys]}

@reader_router.get("/workers")
async def get_workers(
    organization: Optional[str] = Query(None),
    position: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    workers = await repo.get_workers(organization, position)
    return {"data": [dict(row) for row in workers]}

@reader_router.get("/retirees",response_model=List[Retiree])
async def get_retirees(
    organization: Optional[str] = Query(None),
    experience: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    retirees = await repo.get_retirees(organization, experience)
    return [Retiree(**row) for row in retirees]

@reader_router.delete("/{reader_id}")
async def delete_reader_by_id(reader_id: int, db: AsyncSession = Depends(get_db)):
    repo = ReaderRepository(db)
    return await repo.delete_reader_by_id(reader_id=reader_id)

@reader_router.get("/readers/unreturned-loans/", response_model=List[Reader])
async def get_readers_with_unreturned_loans(title: str, db: AsyncSession = Depends(get_db)):
    repo = ReaderRepository(db)
    readers = await repo.get_readers_with_unreturned_loan_by_work_title(title)
    if not readers:
        raise HTTPException(status_code=404, detail="No readers found with unreturned loans for this title")
    return readers