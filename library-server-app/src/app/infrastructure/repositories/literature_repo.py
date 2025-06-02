from typing import List, Optional
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date


class LiteratureRepository:
    def __init__(self, db: AsyncSession):
        self.db = db


    async def get_inventory_operations_by_date_range(
        self, start_date: date, end_date: date
    ) -> List[dict]:
        query = text("""
            SELECT e.title, i.operation_type, i.date
            FROM Inventory i
            JOIN Edition e ON i.edition_id = e.id
            WHERE i.date BETWEEN :start_date AND :end_date;
        """)
        result = await self.db.execute(query, {
            "start_date": start_date,
            "end_date": end_date
        })
        return result.mappings().all()
    

    async def get_inventory_numbers_by_work_title(self, title: str) -> List[dict]:
        query = text("""
            SELECT c.id AS inventory_number, e.title
            FROM Copy c
            JOIN Edition e ON c.edition_id = e.id
            JOIN Edition_Work ew ON e.id = ew.edition_id
            JOIN Work w ON ew.work_id = w.id
            WHERE w.title = :title
        """)
        result = await self.db.execute(query, {"title": title})
        return result.mappings().all()
    

    async def get_copies_by_author(self, author_name: str) -> List[dict]:
        query = text("""
            SELECT DISTINCT c.id AS inventory_number, e.title
            FROM Copy c
            JOIN Edition e ON c.edition_id = e.id
            JOIN Edition_Work ew ON e.id = ew.edition_id
            JOIN Work w ON ew.work_id = w.id
            JOIN Work_Author wa ON w.id = wa.work_id
            JOIN Author a ON wa.author_id = a.id
            WHERE a.name = :author_name
        """)
        result = await self.db.execute(query, {"author_name": author_name})
        return result.mappings().all()
    

    async def get_top_loaned_works(self, limit: int = 10) -> List[dict]:
        query = text("""
            SELECT w.title, COUNT(*) AS loan_count
            FROM Loan l
            JOIN Copy c ON l.copy_id = c.id
            JOIN Edition e ON c.edition_id = e.id
            JOIN Edition_Work ew ON e.id = ew.edition_id
            JOIN Work w ON ew.work_id = w.id
            GROUP BY w.title
            ORDER BY loan_count DESC
            LIMIT :limit
        """)
        result = await self.db.execute(query, {"limit": limit})
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