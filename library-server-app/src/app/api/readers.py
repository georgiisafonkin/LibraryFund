from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from src.app.db.db import get_db
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date

from src.app.domain.models import *
from src.app.infrastructure.repositories.reader_repo import ReaderRepository
from typing import Optional

reader_router = APIRouter(prefix="/readers", tags=["readers"])

@reader_router.get("/readers")
def list_readers(service):
    pass

@reader_router.post("/student")
async def create_student(
    name: str = Query(...),
    birth_date: date = Query(...),
    library_id: int = Query(...),
    university: str = Query(...),
    faculty: str = Query(...),
    course: str = Query(...),
    group_number: int = Query(...),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    reader_id = await repo.create_student(
        name=name,
        birth_date=birth_date,
        library_id=library_id,
        university=university,
        faculty=faculty,
        course=course,
        group_number=group_number
    )
    return {"reader_id": reader_id}


@reader_router.post("/scientist")
async def create_scientist(
    name: str = Query(...),
    birth_date: date = Query(...),
    library_id: int = Query(...),
    organization: str = Query(...),
    research_topic: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    reader_id = await repo.create_scientist(
        name=name,
        birth_date=birth_date,
        library_id=library_id,
        organization=organization,
        research_topic=research_topic
    )
    return {"reader_id": reader_id}


@reader_router.post("/teacher")
async def create_teacher(
    name: str = Query(...),
    birth_date: date = Query(...),
    library_id: int = Query(...),
    subject: str = Query(...),
    school_addr: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    reader_id = await repo.create_teacher(
        name=name,
        birth_date=birth_date,
        library_id=library_id,
        subject=subject,
        school_addr=school_addr
    )
    return {"reader_id": reader_id}


@reader_router.post("/schoolboy")
async def create_schoolboy(
    name: str = Query(...),
    birth_date: date = Query(...),
    library_id: int = Query(...),
    school_addr: str = Query(...),
    school_class: int = Query(...),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    reader_id = await repo.create_schoolboy(
        name=name,
        birth_date=birth_date,
        library_id=library_id,
        school_addr=school_addr,
        school_class=school_class
    )
    return {"reader_id": reader_id}


@reader_router.post("/worker")
async def create_worker(
    name: str = Query(...),
    birth_date: date = Query(...),
    library_id: int = Query(...),
    organization: str = Query(...),
    position: str = Query(...),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    reader_id = await repo.create_worker(
        name=name,
        birth_date=birth_date,
        library_id=library_id,
        organization=organization,
        position=position
    )
    return {"reader_id": reader_id}


@reader_router.post("/retiree")
async def create_retiree(
    name: str = Query(...),
    birth_date: date = Query(...),
    library_id: int = Query(...),
    organization: str = Query(...),
    experience: int = Query(...),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    reader_id = await repo.create_retiree(
        name=name,
        birth_date=birth_date,
        library_id=library_id,
        organization=organization,
        experience=experience
    )
    return {"reader_id": reader_id}


@reader_router.get("/students", response_model=List[Student])
async def get_students(
    university: Optional[str] = Query(None),
    faculty: Optional[str] = Query(None),
    course: Optional[str] = Query(None),
    group_number: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    students = await repo.get_students(university, faculty, course, group_number)
    return [Student(**row) for row in students]


@reader_router.get("/scientists", response_model=List[Scientist])
async def get_scientists(
    organization: Optional[str] = Query(None),
    research_topic: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    scientists = await repo.get_scientists(organization, research_topic)
    return [Scientist(**row) for row in scientists]


@reader_router.get("/teachers", response_model=List[Teacher])
async def get_teachers(
    subject: Optional[str] = Query(None),
    school_addr: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    teachers = await repo.get_teachers(subject, school_addr)
    return [Teacher(**row) for row in teachers]


@reader_router.get("/schoolboys", response_model=List[Schoolboy])
async def get_schoolboys(
    school_addr: Optional[str] = Query(None),
    school_class: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    schoolboys = await repo.get_schoolboys(school_addr, school_class)
    return [Schoolboy(**row) for row in schoolboys]


@reader_router.get("/workers", response_model=List[WorkerReader])
async def get_workers(
    organization: Optional[str] = Query(None),
    position: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    workers = await repo.get_workers(organization, position)
    return [WorkerReader(**row) for row in workers]

@reader_router.get("/retirees",response_model=List[Retiree])
async def get_retirees(
    organization: Optional[str] = Query(None),
    experience: Optional[int] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    retirees = await repo.get_retirees(organization, experience)
    return [Retiree(**row) for row in retirees]

@reader_router.put("/students/{reader_id}")
async def update_reader_student(
    reader_id: int,
    name: Optional[str]=None,
    birth_date: Optional[date]=None,
    university: Optional[str]=None,
    faculty: Optional[str]=None,
    course: Optional[str]=None,
    group_number: Optional[int]=None,
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    return await repo.update_reader_student(
        reader_id=reader_id,
        name=name,
        birth_date=birth_date,
        university=university,
        faculty=faculty,
        course=course,
        group_number=group_number
    )


@reader_router.put("/schoolboys/{reader_id}")
async def update_reader_schoolboy(
    reader_id: int,
    name: str = None,
    birth_date: date = None,
    school_addr: str = None,
    school_class: int = None,
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    return await repo.update_reader_schoolboy(
        reader_id=reader_id,
        name=name,
        birth_date=birth_date,
        school_addr=school_addr,
        school_class=school_class
    )


@reader_router.put("/scientists/{reader_id}")
async def update_reader_scientist(
    reader_id: int,
    name: str = None,
    birth_date: date = None,
    organization: str = None,
    research_topic: str = None,
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    return await repo.update_reader_scientist(
        reader_id=reader_id,
        name=name,
        birth_date=birth_date,
        organization=organization,
        research_topic=research_topic
    )


@reader_router.put("/teachers/{reader_id}")
async def update_reader_teacher(
    reader_id: int,
    name: str = None,
    birth_date: date = None,
    subject: str = None,
    school_addr: str = None,
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    return await repo.update_reader_teacher(
        reader_id=reader_id,
        name=name,
        birth_date=birth_date,
        subject=subject,
        school_addr=school_addr
    )

@reader_router.put("/retirees/{reader_id}")
async def update_reader_retiree(
    reader_id: int,
    name: str = None,
    birth_date: date = None,
    organization: str = None,
    experience: int = None,
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    return await repo.update_reader_retiree(
        reader_id=reader_id,
        name=name,
        birth_date=birth_date,
        organization=organization,
        experience=experience
    )



@reader_router.delete("/{reader_id}")
async def delete_reader_by_id(reader_id: int, db: AsyncSession = Depends(get_db)):
    repo = ReaderRepository(db)
    return await repo.delete_reader_by_id(reader_id=reader_id)

@reader_router.get("/unreturned-loans", response_model=List[Reader])
async def get_readers_with_unreturned_loans(title: str, db: AsyncSession = Depends(get_db)):
    """
    Выдать перечень читателей, на руках у которых находится указанное произведение.

    """
    repo = ReaderRepository(db)
    readers = await repo.get_readers_with_unreturned_loan_by_work_title(title)
    return readers


@reader_router.get("/unreturned-by-edition-title", response_model=List[Reader])
async def get_readers_with_unreturned_loan_by_edition_title(
    title: str = Query(..., description="Название выпуска"),
    db: AsyncSession = Depends(get_db)
):
    """
    Получить список читателей, на руках у которых находится указанное издание

    """
    repo = ReaderRepository(db)
    readers = await repo.get_readers_with_unreturned_loan_by_edition_title(title)
    return readers


@reader_router.get("/edition-loans-by-work-and-date", response_model=List[dict])
async def get_readers_and_editions_by_work_and_date_range(
    title: str = Query(..., description="Название произведения"),
    start_date: date = Query(..., description="Начальная дата (YYYY-MM-DD)"),
    end_date: date = Query(..., description="Конечная дата (YYYY-MM-DD)"),
    db: AsyncSession = Depends(get_db)
):
    """
    Получить перечень читателей,
    которые в течение указанного промежутка времени получали издание с некоторым произведением,
    и название этого издания

    """
    repo = ReaderRepository(db)
    result = await repo.get_readers_and_editions_by_work_and_date_range(title, start_date, end_date)
    return result


@reader_router.get("/readers-by-librarian", response_model=List[Reader])
async def get_readers_by_librarian_and_loan_period(
    librarian_id: int = Query(..., description="ID библиотекаря"),
    start_date: date = Query(..., description="Начальная дата"),
    end_date: date = Query(..., description="Конечная дата"),
    db: AsyncSession = Depends(get_db)
):
    """
    Выдать список читателей, которые в течение обозначенного периода были обслужены указанным библиотекарем

    """
    repo = ReaderRepository(db)
    readers =  await repo.get_readers_by_librarian_and_loan_period(librarian_id, start_date, end_date)
    return [Reader(**row) for row in readers]


@reader_router.get("/overdue", response_model=List[Reader])
async def get_overdue_readers(db: AsyncSession = Depends(get_db)):
    """
    Получить список читателей с просроченным сроком литературы
    
    """
    repo = ReaderRepository(db)
    readers = await repo.get_overdue_readers()
    return [Reader(**row) for row in readers]


@reader_router.get("/no-visits", response_model=List[Reader])
async def get_readers_without_loans_in_period(
    start_date: date = Query(..., description="Start of period (YYYY-MM-DD)"),
    end_date: date = Query(..., description="End of period (YYYY-MM-DD)"),
    db: AsyncSession = Depends(get_db)
):
    """
    Получить список читателей, не посещавших библиотеку в течение указанного времени

    """
    repo = ReaderRepository(db)
    readers = await repo.get_readers_without_loans_in_period(start_date, end_date)
    return [Reader(**row) for row in readers]

@reader_router.put("/workers/{reader_id}")
async def update_reader_worker(
    reader_id: int,
    name: str = None,
    birth_date: date = None,
    organization: str = None,
    position: str = None,
    db: AsyncSession = Depends(get_db)
):
    repo = ReaderRepository(db)
    return await repo.update_reader_worker(
        reader_id=reader_id,
        name=name,
        birth_date=birth_date,
        organization=organization,
        position=position
    )