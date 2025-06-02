from typing import List, Optional
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date


class LibrarianRepository:
    def __init__(self, db: AsyncSession):
        self.db = db


    async def get_librarians_with_reader_counts(self, start_date: date, end_date: date) -> List[dict]:
        query = text("""
            SELECT librarian.id, librarian.name, COUNT(reader_id) AS total_readers
            FROM Loan
            JOIN Librarian ON librarian.id = loan.librarian_id
            WHERE loan_date BETWEEN :start_date AND :end_date
            GROUP BY librarian.id, librarian.name
        """)
        result = await self.db.execute(query, {
            "start_date": start_date,
            "end_date": end_date
        })
        return result.mappings().all()
    

    async def get_librarians_by_hall_and_library(self, hall_name: str, library_id: int) -> List[dict]:
        query = text("""
            SELECT DISTINCT l.*
            FROM Librarians_Halls lh
            JOIN Librarian l ON lh.librarian_id = l.id
            JOIN Hall h ON lh.hall_id = h.id
            WHERE h.name = :hall_name AND h.library_id = :library_id;
        """)
        result = await self.db.execute(query, {
            "hall_name": hall_name,
            "library_id": library_id
        })
        return result.mappings().all()