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
    

    async def get_readers_by_librarian_and_loan_period(self, librarian_id: int, start_date: date, end_date: date) -> List[dict]:
        query = text("""
            SELECT DISTINCT r.*
            FROM Loan l
            JOIN Reader r ON l.reader_id = r.id
            WHERE l.librarian_id = :librarian_id
              AND l.loan_date BETWEEN :start_date AND :end_date
        """)
        result = await self.db.execute(query, {
            "librarian_id": librarian_id,
            "start_date": start_date,
            "end_date": end_date
        })
        return result.mappings().all()
    

    async def count_readers_grouped_by_librarian(self, start_date: date, end_date: date) -> List[dict]:
        query = text("""
            SELECT librarian_id, COUNT(reader_id) AS total_readers
            FROM Loan
            WHERE loan_date BETWEEN :start_date AND :end_date
            GROUP BY librarian_id
        """)
        result = await self.db.execute(query, {
            "start_date": start_date,
            "end_date": end_date
        })
        return result.mappings().all()
    
    async def get_overdue_readers(self) -> List[dict]:
        query = text("""
            SELECT DISTINCT r.*
            FROM Loan l
            JOIN Reader r ON l.reader_id = r.id
            WHERE l.return_date IS NULL
              AND CURRENT_DATE > l.loan_date + INTERVAL '1 day' * l.due_date;
        """)
        result = await self.db.execute(query)
        return result.mappings().all()
    

    async def get_readers_without_loans_in_period(self, start_date: date, end_date: date) -> List[dict]:
        query = text("""
            SELECT *
            FROM Reader
            WHERE id NOT IN (
                SELECT DISTINCT reader_id
                FROM Loan
                WHERE (loan_date BETWEEN :start_date AND :end_date)
                   OR (return_date BETWEEN :start_date AND :end_date)
            );
        """)
        result = await self.db.execute(query, {
            "start_date": start_date,
            "end_date": end_date
        })
        return result.mappings().all()
    
    async def update_reader_student(
        self,
        reader_id: int,
        name: str = None,
        birth_date: date = None,
        university: str = None,
        faculty: str = None,
        course: str = None,
        group_number: int = None
    ):
        query = text("""
            SELECT update_student_reader(
                :reader_id,
                :name,
                :birth_date,
                :university,
                :faculty,
                :course,
                :group_number
            );
        """)

        result = await self.db.execute(query, {
            "reader_id": reader_id,
            "name": name,
            "birth_date": birth_date,
            "university": university,
            "faculty": faculty,
            "course": course,
            "group_number": group_number
        })
        await self.db.commit()
        return result
    
    async def update_reader_schoolboy(
        self,
        reader_id: int,
        name: str = None,
        birth_date: date = None,
        school_addr: str = None,
        school_class: int = None
    ):
        query = text("""
            SELECT update_schoolboy_reader(
                :reader_id,
                :name,
                :birth_date,
                :school_addr,
                :school_class
            );
        """)
        await self.db.execute(query, {
            "reader_id": reader_id,
            "name": name,
            "birth_date": birth_date,
            "school_addr": school_addr,
            "school_class": school_class
        })
        await self.db.commit()
        return {"status": "success", "message": "Schoolboy reader updated"}
    

    async def update_reader_scientist(
        self,
        reader_id: int,
        name: str = None,
        birth_date: date = None,
        organization: str = None,
        research_topic: str = None
    ):
        query = text("""
            SELECT update_scientist_reader(
                :reader_id,
                :name,
                :birth_date,
                :organization,
                :research_topic
            );
        """)
        await self.db.execute(query, {
            "reader_id": reader_id,
            "name": name,
            "birth_date": birth_date,
            "organization": organization,
            "research_topic": research_topic
        })
        await self.db.commit()
        return {"status": "success", "message": "Scientist reader updated"}
    

    async def update_reader_teacher(
        self,
        reader_id: int,
        name: str = None,
        birth_date: date = None,
        subject: str = None,
        school_addr: str = None
    ):
        query = text("""
            SELECT update_teacher_reader(
                :reader_id,
                :name,
                :birth_date,
                :subject,
                :school_addr
            );
        """)
        await self.db.execute(query, {
            "reader_id": reader_id,
            "name": name,
            "birth_date": birth_date,
            "subject": subject,
            "school_addr": school_addr
        })
        await self.db.commit()
        return {"status": "success", "message": "Teacher reader updated"}
    

    async def update_reader_retiree(
        self,
        reader_id: int,
        name: str = None,
        birth_date: date = None,
        organization: str = None,
        experience: int = None
    ):
        query = text("""
            SELECT update_retiree_reader(
                :reader_id,
                :name,
                :birth_date,
                :organization,
                :experience
            );
        """)
        await self.db.execute(query, {
            "reader_id": reader_id,
            "name": name,
            "birth_date": birth_date,
            "organization": organization,
            "experience": experience
        })
        await self.db.commit()
        return {"status": "success", "message": "Retiree reader updated"}
    

    async def update_reader_worker(
        self,
        reader_id: int,
        name: str = None,
        birth_date: date = None,
        organization: str = None,
        position: str = None
    ):
        query = text("""
            SELECT update_worker_reader(
                :reader_id,
                :name,
                :birth_date,
                :organization,
                :position
            );
        """)
        await self.db.execute(query, {
            "reader_id": reader_id,
            "name": name,
            "birth_date": birth_date,
            "organization": organization,
            "position": position
        })
        await self.db.commit()
        return {"status": "success", "message": "Worker reader updated"}
