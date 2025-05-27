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