from fastapi import APIRouter, Depends


reader_router = APIRouter()

@reader_router.get("/readers")
def list_readers(service):
    pass