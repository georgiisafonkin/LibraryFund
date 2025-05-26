from pydantic import BaseModel
from typing import Optional
from datetime import date

class Reader(BaseModel):
    name: str
    birth_date: date
    library_id: int