from pydantic import BaseModel

class WorkLoanCount(BaseModel):
    title: str
    loan_count: int