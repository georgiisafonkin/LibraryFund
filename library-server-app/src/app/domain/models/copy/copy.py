from pydantic import BaseModel


class Copy(BaseModel):
    inventory_number: int
    title: str