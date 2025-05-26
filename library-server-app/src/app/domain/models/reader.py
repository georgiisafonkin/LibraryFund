from pydantic import BaseModel, Field
from typing import Optional
from datetime import date

class Reader(BaseModel):
    id: int
    name: str
    birth_date: date
    library_id: int