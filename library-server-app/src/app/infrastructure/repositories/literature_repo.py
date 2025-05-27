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
