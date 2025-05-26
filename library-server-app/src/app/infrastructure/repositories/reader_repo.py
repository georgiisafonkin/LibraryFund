from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date


class ReaderRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_student(self, name: str, birth_date: date, library_id: int,
                             university: str, faculty: str, course: str, group_number: int) -> int:
        result = await self.db.execute(text("""
            SELECT create_student_reader(:name, :birth_date, :library_id, :university, :faculty, :course, :group_number)
        """), {
            "name": name,
            "birth_date": birth_date,
            "library_id": library_id,
            "university": university,
            "faculty": faculty,
            "course": course,
            "group_number": group_number
        })
        await self.db.commit()
        return result.scalar_one()

    async def create_scientist(self, name: str, birth_date: date, library_id: int,
                               organization: str, research_topic: str) -> int:
        result = await self.db.execute(text("""
            SELECT create_scientist_reader(:name, :birth_date, :library_id, :organization, :research_topic)
        """), {
            "name": name,
            "birth_date": birth_date,
            "library_id": library_id,
            "organization": organization,
            "research_topic": research_topic
        })
        await self.db.commit()
        return result.scalar_one()

    async def create_teacher(self, name: str, birth_date: date, library_id: int,
                             subject: str, school_addr: str) -> int:
        result = await self.db.execute(text("""
            SELECT create_teacher_reader(:name, :birth_date, :library_id, :subject, :school_addr)
        """), {
            "name": name,
            "birth_date": birth_date,
            "library_id": library_id,
            "subject": subject,
            "school_addr": school_addr
        })
        await self.db.commit()
        return result.scalar_one()

    async def create_schoolboy(self, name: str, birth_date: date, library_id: int,
                               school_addr: str, school_class: int) -> int:
        result = await self.db.execute(text("""
            SELECT create_schoolboy_reader(:name, :birth_date, :library_id, :school_addr, :school_class)
        """), {
            "name": name,
            "birth_date": birth_date,
            "library_id": library_id,
            "school_addr": school_addr,
            "school_class": school_class
        })
        await self.db.commit()
        return result.scalar_one()

    async def create_worker(self, name: str, birth_date: date, library_id: int,
                            organization: str, position: str) -> int:
        result = await self.db.execute(text("""
            SELECT create_worker_reader(:name, :birth_date, :library_id, :organization, :position)
        """), {
            "name": name,
            "birth_date": birth_date,
            "library_id": library_id,
            "organization": organization,
            "position": position
        })
        await self.db.commit()
        return result.scalar_one()

    async def create_retiree(self, name: str, birth_date: date, library_id: int,
                             organization: str, experience: int) -> int:
        result = await self.db.execute(text("""
            SELECT create_retiree_reader(:name, :birth_date, :library_id, :organization, :experience)
        """), {
            "name": name,
            "birth_date": birth_date,
            "library_id": library_id,
            "organization": organization,
            "experience": experience
        })
        await self.db.commit()
        return result.scalar_one()
