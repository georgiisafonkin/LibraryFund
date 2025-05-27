from pydantic import BaseModel

class Edition(BaseModel):
    id: int
    title: str