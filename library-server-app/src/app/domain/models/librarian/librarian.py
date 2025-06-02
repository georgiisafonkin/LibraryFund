from pydantic import BaseModel

class Librarian(BaseModel):
    id: int
    name: str