from pydantic import BaseModel

class Edition(BaseModel):
    id: int
    title: str
    type_id: int
    loean_rule: int