from pydantic import BaseModel
from typing import Optional
from datetime import date

class Reader(BaseModel):
    id: int
    name: str
    birth_date: date
    library_id: int
    category: int