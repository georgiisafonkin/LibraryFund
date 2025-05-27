from typing import List, Optional
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date


class ReaderRepository:
    def __init__(self, db: AsyncSession):
        self.db = db


    # ======================== CRUD ========================
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
    
    async def get_students(
        self,
        university: Optional[str] = None,
        faculty: Optional[str] = None,
        course: Optional[str] = None,
        group_number: Optional[int] = None,
    ) -> List[dict]:
        query = text("""
            SELECT * FROM get_students(:university, :faculty, :course, :group_number)
        """)
        result = await self.db.execute(
            query,
            {
                "university": university,
                "faculty": faculty,
                "course": course,
                "group_number": group_number,
            }
        )
        return result.mappings().all()

    async def get_scientists(
        self, 
        organization: Optional[str] = None, 
        research_topic: Optional[str] = None
    ) -> List[dict]:
        query = text("""
            SELECT * FROM get_scientists(:organization, :research_topic)
        """)
        result = await self.db.execute(query, {"organization": organization, "research_topic": research_topic})
        return result.mappings().all()

    async def get_teachers(
        self, 
        subject: Optional[str] = None, 
        school_addr: Optional[str] = None
    ) -> List[dict]:
        query = text("""
            SELECT * FROM get_teachers(:subject, :school_addr)
        """)
        result = await self.db.execute(query, {"subject": subject, "school_addr": school_addr})
        return result.mappings().all()

    async def get_schoolboys(
        self, 
        school_addr: Optional[str] = None, 
        school_class: Optional[int] = None
    ) -> List[dict]:
        query = text("""
            SELECT * FROM get_schoolboys(:school_addr, :school_class)
        """)
        result = await self.db.execute(query, {"school_addr": school_addr, "school_class": school_class})
        return result.mappings().all()

    async def get_workers(
        self, 
        organization: Optional[str] = None, 
        position: Optional[str] = None
    ) -> List[dict]:
        query = text("""
            SELECT * FROM get_workers(:organization, :position)
        """)
        result = await self.db.execute(query, {"organization": organization, "position": position})
        return result.mappings().all()

    async def get_retirees(
        self, 
        organization: Optional[str] = None, 
        experience: Optional[int] = None
    ) -> List[dict]:
        query = text("""
            SELECT * FROM get_retirees(:organization, :experience)
        """)
        result = await self.db.execute(query, {"organization": organization, "experience": experience})
        return result.mappings().all()

    async def delete_reader_by_id(self, reader_id: int) -> None:
        await self.db.execute(text("SELECT delete_reader_by_id(:id)"), {"id": reader_id})
        await self.db.commit()


    async def get_readers_with_unreturned_loan_by_work_title(self, title: str) -> List[dict]:
        query = text("""
            SELECT DISTINCT r.*
            FROM Loan l
            JOIN Reader r ON l.reader_id = r.id
            JOIN Copy c ON l.copy_id = c.id
            JOIN Edition e ON c.edition_id = e.id
            JOIN Edition_Work ew ON e.id = ew.edition_id
            JOIN Work w ON ew.work_id = w.id
            WHERE w.title = :title AND l.return_date IS NULL
        """)
        result = await self.db.execute(query, {"title": title})
        return result.mappings().all()
    

    async def get_readers_with_unreturned_loan_by_edition_title(self, title: str) -> List[dict]:
        query = text("""
            SELECT DISTINCT r.*
            FROM Loan l
            JOIN Reader r ON l.reader_id = r.id
            JOIN Copy c ON l.copy_id = c.id
            JOIN Edition e ON c.edition_id = e.id
            WHERE e.title = :title AND l.return_date IS NULL
        """)
        result = await self.db.execute(query, {"title": title})
        return result.mappings().all()
    

    async def get_readers_and_editions_by_work_and_date_range(
        self,
        work_title: str,
        start_date: date,
        end_date: date
    ) -> List[dict]:
        query = text("""
            SELECT DISTINCT r.name, e.title
            FROM Loan l
            JOIN Reader r ON l.reader_id = r.id
            JOIN Copy c ON l.copy_id = c.id
            JOIN Edition e ON c.edition_id = e.id
            JOIN Edition_Work ew ON e.id = ew.edition_id
            JOIN Work w ON ew.work_id = w.id
            WHERE w.title = :title
              AND l.loan_date BETWEEN :start_date AND :end_date
        """)
        result = await self.db.execute(query, {
            "title": work_title,
            "start_date": start_date,
            "end_date": end_date
        })
        return result.mappings().all()
    
    async def get_loaned_editions_by_reader_and_date_range(
        self,
        reader_id: int,
        start_date: date,
        end_date: date
    ) -> List[str]:
        query = text("""
            SELECT DISTINCT e.title
            FROM Loan l
            JOIN Reader r ON l.reader_id = r.id
            JOIN Copy c ON l.copy_id = c.id
            JOIN Edition e ON c.edition_id = e.id
            WHERE r.id = :reader_id
              AND l.loan_date BETWEEN :start_date AND :end_date
        """)
        result = await self.db.execute(query, {
            "reader_id": reader_id,
            "start_date": start_date,
            "end_date": end_date
        })
        return result.mappings().all()
    

    async def get_foreign_library_loans(
        self, reader_id: int, start_date: date, end_date: date
    ) -> List[str]:
        query = text("""
            SELECT DISTINCT e.title
            FROM Loan l
            JOIN Reader r ON l.reader_id = r.id
            JOIN Copy c ON l.copy_id = c.id
            JOIN Edition e ON c.edition_id = e.id
            JOIN Shelf s ON c.shelf_id = s.id
            JOIN Rack ra ON s.rack_id = ra.id
            JOIN Hall h ON ra.hall_id = h.id
            WHERE r.id = :reader_id
              AND h.library_id <> r.library_id
              AND l.loan_date BETWEEN :start_date AND :end_date
        """)
        
        result = await self.db.execute(query, {
            "reader_id": reader_id,
            "start_date": start_date,
            "end_date": end_date
        })
        return result.mappings().all()
    
    async def get_unreturned_titles_by_shelf(self, shelf_id: int) -> List[str]:
        query = text("""
            SELECT e.title
            FROM Copy c
            JOIN Edition e ON c.edition_id = e.id
            JOIN Loan l ON l.copy_id = c.id
            WHERE c.shelf_id = :shelf_id AND l.return_date IS NULL
        """)
        result = await self.db.execute(query, {"shelf_id": shelf_id})
        return result.mappings().all()